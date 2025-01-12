'use client';

import homeStyle from '../components/assets/styles/home.module.css';
import navbarStyle from '../components/assets/styles/navbar.module.css';
import BookGrid from '../components/BookGrid';
import { useRef, useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) {
    setError('No file selected.');
    return;
  }

  setUploading(true);
  setError('');
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.success) {
      console.log('File upload successful:'+ data.fileName);
    } else {
      setError(data.error);
      console.error('Upload failed:', data.error);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    setError('An error uploading file.');
  } finally {
    setUploading(false);
  }
};

  return (
    <main className={homeStyle.main}>
      <nav className={navbarStyle.navbar}>
        {/* Left Section: Logo */}
        <div className={navbarStyle.navbarLeft}>
          <Image
            src="/assets/icons/B&N_nook_Logo.png" // Replace with your logo path
            alt="Logo"
            width={40}
            height={40}
            className={navbarStyle.logo}
          />
        </div>

        {/* Right Section: Add Button */}
        <div className={navbarStyle.navbarRight}>
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            style={{ display: 'none' }} // Hides the input field
          />

          {/* Button to Trigger File Upload */}
          <button
            disabled={uploading}
            className={navbarStyle.addButton}
            onClick={() => fileInputRef.current?.click()} // Simulates a click on the hidden input
          >
            {uploading ? '...' : '+'}
          </button>

          {/* Display Error if Exists */}
          {error && <p className={homeStyle.error}>{error}</p>}
        </div>
      </nav>
      <BookGrid />
    </main>
  );
}
