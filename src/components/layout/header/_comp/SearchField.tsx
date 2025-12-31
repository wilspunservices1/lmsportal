import React, { useState } from "react";
import ItemDrawer from "./ItemDrawer";
import { useSearch } from "@/contexts/SearchContext";
import { useEffect } from "react";

const SearchField: React.FC = () => {
  const { searchQuery, setSearchQuery, toggleDrawer, isDrawerOpen } =
    useSearch();
  const [isFocused, setIsFocused] = useState(false);

  // Open the drawer when input is focused
  const handleFocus = () => {
    setIsFocused(true);
    if (!isDrawerOpen) {
      toggleDrawer();
    }
  };

  // Optionally, close the dropdown when focus is lost
  const handleBlur = () => {
    setIsFocused(false);
  };

  // Use effect to track changes in searchQuery and adjust the isFocused state
  useEffect(() => {
    if (searchQuery.length !== 0 ) {
      setIsFocused(true);
      if (!isDrawerOpen) {
        toggleDrawer();
      }
    } else {
      setIsFocused(false);
    }
  }, [searchQuery, isDrawerOpen, toggleDrawer]);

  return (
    <div
      className={`relative ${
        isFocused ? "nav-list" : ""
      }`}
    >
      <div className={`group relative transition-all duration-300 ${
        isFocused ? "w-48 sm:w-28 md:w-32" : "w-5"
      }`}>
        <button
          type="button"
          onClick={handleFocus}
          className="absolute inset-y-0 left-0 flex items-center pl-0 pointer-events-auto"
        >
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
        {/* Search Input - only show when focused */}
        {isFocused && (
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="w-full h-10 pl-8 pr-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            autoFocus
          />
        )}
        {/* Pass the search query to ItemDrawer */}
        {isFocused && <ItemDrawer searchQuery={searchQuery} />}
      </div>
    </div>
  );
};

export default SearchField;

