import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, AlertCircle, Check, ArrowLeft } from 'lucide-react';

const ScanPage = () => {
  // Add explicit types for useState hooks
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  interface DetectedObject {
    name: string;
    category: string;
    confidence: number;
    // Add more fields if needed
  }

  interface ScanResults {
    detection_result?: {
      total_objects?: number;
      objects?: DetectedObject[];
    };
    items_added?: number;
    success?: boolean;
    error?: string;
    // Add more fields if needed
  }

  const [scanResults, setScanResults] = useState<ScanResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API base URL - update this to match your backend
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setError(null);
      setScanResults(null);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsScanning(true);
    setError(null);

    try {
      // Create FormData to send the file
      const formData = new FormData();
      formData.append('image', selectedFile);

      console.log('Sending file to backend:', selectedFile.name);

      // Send to your backend detection endpoint
      const response = await fetch(`${API_BASE_URL}/detect-objects`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Backend response:', data);

      if (response.ok && data.success) {
        setScanResults(data);
        setError(null);
      } else {
        throw new Error(data.error || 'Scan failed');
      }

    } catch (err) {
      console.error('Scan error:', err);
      
      // Handle different types of errors
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        setError(`Cannot connect to backend server at ${API_BASE_URL}. Make sure the backend is running: cd backend && npm start`);
      } else if (err instanceof Error) {
        setError(err.message || 'Failed to scan image. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Add types to event handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setError(null);
        setScanResults(null);
      }
    }
  };

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/../health`);
      if (response.ok) {
        setBackendStatus('connected');
        setError(null);
      } else {
        setBackendStatus('disconnected');
      }
    } catch (err) {
      setBackendStatus('disconnected');
      console.error('Backend health check failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-xl font-semibold text-white">AI Room Scanner</h1>
            <div className="w-24"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            🧠 AI Design Suggestions
          </h2>
          <p className="text-white/80">
            Upload a photo of your room and let AI suggest design improvements
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div
            className="border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-white/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              ref={fileInputRef}
            />
            
            {!previewUrl ? (
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
                <p className="text-white/80 mb-2">Click to upload or drag an image here</p>
                <p className="text-sm text-white/60">PNG, JPG, GIF up to 16MB</p>
              </label>
            ) : (
              <div className="space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg mx-auto"
                />
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={handleScan}
                    disabled={isScanning}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                  >
                    {isScanning ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5" />
                    )}
                    {isScanning ? 'Analyzing...' : 'Scan Room'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {scanResults && scanResults.detection_result?.objects && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-green-200">
                Scan Complete!
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {scanResults.detection_result.objects.map((obj: DetectedObject, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                  <div>
                    <span className="font-medium text-white">{obj.name}</span>
                    <p className="text-sm text-white/70">{obj.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 bg-blue-500/50 text-blue-200 rounded">
                      {Math.round(obj.confidence * 100)}% confident
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => window.location.href = '/inventory'}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                View Inventory
              </button>
              <button
                onClick={() => window.location.href = '/marketplace'}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          </div>
        )}

        {/* Debug Info */}
        <details className="mt-6 bg-white/5 rounded-lg p-4">
          <summary className="cursor-pointer text-white/80 font-medium">
            🔍 Debug Information
          </summary>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-white/70">
              <strong>Backend URL:</strong> {API_BASE_URL}
            </p>
            <p className="text-white/70">
              <strong>Backend Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                backendStatus === 'connected' ? 'bg-green-500/50 text-green-200' :
                backendStatus === 'disconnected' ? 'bg-red-500/50 text-red-200' :
                'bg-gray-500/50 text-gray-200'
              }`}>
                {backendStatus === 'connected' ? '✅ Connected' :
                 backendStatus === 'disconnected' ? '❌ Disconnected' :
                 '❓ Unknown'}
              </span>
            </p>
            <button
              onClick={checkBackendHealth}
              className="px-3 py-1 bg-blue-500/50 text-blue-200 rounded text-xs hover:bg-blue-500/70 transition-colors"
            >
              Test Backend Connection
            </button>
            <p className="text-white/70">
              <strong>Selected file:</strong> {selectedFile?.name || 'None'}
            </p>
            <p className="text-white/70">
              <strong>File size:</strong> {selectedFile ? Math.round(selectedFile.size / 1024) + 'KB' : 'N/A'}
            </p>
            {scanResults && (
              <details className="mt-2">
                <summary className="cursor-pointer text-white/60">Raw Response</summary>
                <pre className="mt-2 text-xs bg-black/20 p-2 rounded overflow-auto text-white/80">
                  {JSON.stringify(scanResults, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </details>
      </div>
    </div>
  );
};

export default ScanPage;

