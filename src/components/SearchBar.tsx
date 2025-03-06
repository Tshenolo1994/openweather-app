import React, { useState } from "react";
import { searchCity } from "../utils/weatherApi";

interface SearchBarProps {
  onSearch: (lat: number, lon: number, name: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    try {
      const cities = await searchCity(query);
      if (cities.length > 0) {
        const { lat, lon, name } = cities[0];
        onSearch(lat, lon, name);
      } else {
        alert("City not found. Please try again.");
      }
    } catch (error) {
      alert("Failed to fetch city data. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col md:flex-row gap-3 w-full"
    >
      <input
        type="text"
        placeholder="Search destination..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-lg"
      />
      <button
        type="submit"
        className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
