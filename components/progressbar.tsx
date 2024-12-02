'use client'

import { useState, useEffect } from 'react';

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <div className="w-full bg-gray-200 rounded-full h-8 mt-4">
      <div
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full flex items-center justify-center text-xs font-medium text-white leading-none rounded-full"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
