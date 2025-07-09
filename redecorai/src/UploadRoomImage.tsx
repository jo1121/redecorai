import * as React from 'react';
import { useState } from 'react';
import type { ChangeEvent } from 'react';


import axios from 'axios';

const UploadRoomImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    setFile(e.target.files[0]);
  }
  };

  const handleUpload = async () => {
  if (!file) {
    alert("Please select an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post("http://localhost:5000/api/upload-room", formData);
    const uploadedFilename = res.data.filename;

    // ✅ Redirect to ScanResult page with filename
    window.location.href = `/scan-result?file=${uploadedFilename}`;
  } catch (error) {
    console.error(error);
    setResponse("Upload failed.");
  }
};


  return (
    <div style={{ padding: "20px" }}>
      <h2>Upload Room Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: "10px" }}>Upload</button>
      <p>{response}</p>
    </div>
  );
};

export default UploadRoomImage;
