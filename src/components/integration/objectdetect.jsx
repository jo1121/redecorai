import React, { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Loader2,
  Check,
  X,
  Package,
  AlertCircle,
} from "lucide-react";
import { useObjectDetection } from "../../hooks/useApi";

const ObjectDetection = ({ onDetectionComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const { detect, isDetecting, result, error } = useObjectDetection();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDetection = async () => {
    if (!selectedFile) return;

    try {
      const result = await detect(selectedFile);
      if (onDetectionComplete) {
        onDetectionComplete(result);
      }
    } catch (error) {
      console.error("Detection failed:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors"
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
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Upload or drag an image here</p>
            <p className="text-sm text-gray-400">PNG, JPG, GIF up to 16MB</p>
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
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Change Image
              </button>
              <button
                onClick={handleDetection}
                disabled={isDetecting}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isDetecting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
                {isDetecting ? "Analyzing..." : "Detect Objects"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Check className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-green-800">
              Detection Complete!
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Objects found:</strong>{" "}
              {result.detection_result?.total_objects || 0}
            </div>
            <div>
              <strong>Added to inventory:</strong> {result.items_added || 0}
            </div>
          </div>

          {result.detection_result?.objects && (
            <div className="mt-3">
              <h4 className="font-medium text-green-800 mb-2">
                Detected Objects:
              </h4>
              <div className="space-y-1">
                {result.detection_result.objects.map((obj, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded"
                  >
                    <span className="font-medium">{obj.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {obj.category}
                      </span>
                      <span className="text-xs text-gray-600">
                        {Math.round(obj.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
