import { useEffect, useState } from 'react';

const AudioList = () => {
  const [audioFiles, setAudioFiles] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10); // Set to 10 items per page

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const response = await fetch('/api/audios', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch audio files: ${response.statusText}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format');
        }

        setAudioFiles(data);
      } catch (error: any) {
        setError(error.message || 'An unknown error occurred');
      }
    };

    fetchAudioFiles();
  }, []);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // Calculate the current audio files to display
  const indexOfLastFile = currentPage * itemsPerPage;
  const indexOfFirstFile = indexOfLastFile - itemsPerPage;
  const currentFiles = audioFiles.slice(indexOfFirstFile, indexOfLastFile);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Create page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(audioFiles.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Audio Files</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentFiles.map((file, index) => {
          const truncatedFileName = file.slice(0, -4); // Adjust as needed

          return (
            <div key={index} className="p-4 border rounded-lg shadow-md">
              <p className="font-semibold">{truncatedFileName}...</p>
              <audio controls className="mt-2">
                <source src={`/audio/${file}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center mt-4">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AudioList;
