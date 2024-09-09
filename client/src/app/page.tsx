'use client';
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';

export default function Home() {
  const [items, setItems] = useState<Product[]>([]);

  const [sortOption, setSortOption] = useState<string>('createdAtAsc');

  // Function to sort filenames with digits
  const customFilenameSort = (a: string, b: string, order: 'asc' | 'desc') => {
    const regex = /(\d+|\D+)/g; // split by number or non-number parts

    const aParts = a.match(regex);
    const bParts = b.match(regex);

    if (!aParts || !bParts) return 0; //If no match, consider equal

    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || '';
      const bPart = bParts[i] || '';

      // check if both parts are numbers

      const aIsNumber = !isNaN(parseInt(aPart));
      const bIsNumber = !isNaN(parseInt(bPart));

      if (aIsNumber && bIsNumber) {
        // compare as numbers if both parts are numeric
        const numCompare = parseInt(aPart) - parseInt(bPart);
        if (numCompare !== 0) return order === 'asc' ? numCompare : -numCompare;
      } else {
        // compare as string if both parts are non-numeric
        const strCompare = aPart.localeCompare(bPart);
        if (strCompare !== 0) return order === 'asc' ? strCompare : -strCompare;
      }
    }

    return 0;
  };

  // fetch data
  const fetchAndSortItems = async (sortOption: string) => {
    const response = await fetch('/api/items');

    const data: Product[] = await response.json();

    let sortedData = [...data];

    // sort logic
    if (sortOption === 'createdAtAsc') {
      sortedData = sortedData.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // console.log(sortedData, 'Sorted');6g
    } else if (sortOption === 'filenameAsc') {
      sortedData = sortedData.sort((a, b) =>
        customFilenameSort(a.filename, b.filename, 'asc')
      );
    } else if (sortOption === 'filenameDesc') {
      sortedData = sortedData.sort((a, b) =>
        customFilenameSort(a.filename, b.filename, 'desc')
      );
    }

    setItems(sortedData);
  };

  useEffect(() => {
    fetchAndSortItems(sortOption);
  }, [sortOption]);
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Product List</h1>

      <div className="md-10">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border-gray-300 rounded-lg bg-white shadow text-gray-900"
        >
          <option value="createdAtAsc" className="text-gray-900">
            Sort by created at (asc)
          </option>
          <option value="filenameAsc" className="text-gray-900">
            {' '}
            Sort by filename (asc)
          </option>
          <option value="filenameDesc" className="text-gray-900">
            Sort by filename (desc)
          </option>
        </select>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-screen-lg"
        style={{ marginTop: '20px' }}
      >
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
              <p className="text-gray-900">{item.createdAt}</p>
              <p className="text-gray-900 font-bold mt-2">{item.filename}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-900 font-bold mt-2">Loading...</p>
        )}
      </div>
    </div>
  );
}
