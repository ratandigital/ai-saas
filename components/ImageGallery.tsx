import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const [firstNames, setFirstNames] = useState<string[]>([]); // To store all first names
  const [selectedFirstName, setSelectedFirstName] = useState(''); // For selected first name filter

  // Fetch first names from the API
  useEffect(() => {
    const fetchFirstNames = async () => {
      const response = await axios.get('/api/users'); // Call your backend endpoint to fetch first names
      setFirstNames(response.data.firstNames);
    };

    fetchFirstNames();
  }, []);

  // Fetch images based on filters
  useEffect(() => {
    const fetchImages = async () => {
      const response = await axios.get(`/api/getimage`, {
        params: {
          page,
          limit: 12,
          search,
          firstName: selectedFirstName, // Use selected first name for filtering
          date,
        },
      });
      setImages(response.data.images);
      setTotalPages(response.data.totalPages);
    };

    fetchImages();
  }, [page, search, selectedFirstName, date]);

  const filteredImages = images.filter(image =>
    image.ansMassage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto">
      <input
        type="text"
        placeholder="Search images"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 p-2 border rounded"
      />
      
      {/* Filter by First Name - Dropdown */}
      <select
        value={selectedFirstName}
        onChange={e => setSelectedFirstName(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Select a First Name</option>
        {firstNames.map((firstName, index) => (
          <option key={index} value={firstName}>
            {firstName}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="mb-4 p-2 border rounded"
      />

      <div className="grid grid-cols-3 gap-4">
        {filteredImages.map(image => (
          <div key={image.id} className="relative">
            <img
              src={image.imageUrl}
              alt={image.promtMassage}
              className="w-full h-auto rounded transition-transform duration-300 transform hover:scale-105"
            />
            <h3 className="text-center mb-10">{image.promtMassage}</h3>
            <a
              href={image.imageUrl}
              download
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-1 rounded"
            >
              Download
            </a>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="bg-gray-500 text-white p-2 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;
