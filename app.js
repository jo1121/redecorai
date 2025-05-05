import React, { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/check-connection')
      .then(res => res.json())
      .then(data => {
        if (data.backend && data.database) {
          setStatus('✅ Connected to Backend and Database');
        } else {
          setStatus('❌ Failed to connect');
        }
      })
      .catch(() => setStatus('❌ Error connecting'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>One Button App</h1>
      <p>{status}</p>
    </div>
  );
}

export default App;
