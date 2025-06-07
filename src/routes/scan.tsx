import React, { useRef, useState } from "react";

export default function Scan() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
      }
    } catch (err) {
      alert("Unable to access camera.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream)
        .getTracks()
        .forEach((track) => track.stop());
    }
    setStreaming(false);
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      setImageData(dataUrl);
      stopCamera();
    }
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImageData(e.target?.result as string);
    reader.readAsDataURL(file);
    stopCamera();
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const retake = () => {
    setImageData(null);
    setScanning(false);
    stopCamera();
  };

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      alert("Scan complete (placeholder)");
      setScanning(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 text-center">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Scan Your Room
      </h2>

      {/* Image area */}
      <div
        className="relative w-full max-w-md h-64 border border-dashed rounded-md bg-white flex items-center justify-center overflow-hidden"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {imageData ? (
          <img
            src={imageData}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        ) : streaming ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <p className="text-gray-400 px-4">
            Drag and drop an image, or use the buttons below to capture or
            upload.
          </p>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      {/* Action buttons */}
      {!imageData ? (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={startCamera}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Open Camera
          </button>
          {streaming && (
            <button
              onClick={capturePhoto}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
            >
              Capture
            </button>
          )}
          <label className="cursor-pointer bg-gray-700 text-white px-5 py-2 rounded hover:bg-gray-800">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload(e.target.files[0]);
              }}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button
            onClick={startScan}
            disabled={scanning}
            className={`px-6 py-2 rounded text-white ${
              scanning ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {scanning ? "Scanning..." : "Start Scan"}
          </button>
          <button
            onClick={retake}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            Retake
          </button>
        </div>
      )}
    </div>
  );
}
