import React from "react";

interface PlaceHolderInterface{
  placeholderText: string,
  searchQuery: string,
  setSearchQuery: (value: string) => void
}

const SearchBar = ({ placeholderText, searchQuery, setSearchQuery }: PlaceHolderInterface) => {
  return (
    <div className="w-[329px] p-2.5 border border-gray-b rounded-4xl bg-white flex items-center gap-[6px]">
      {/* ---------------------------- search icon ---------------------------- */}
      <div className="bg-gray border-gray-b border rounded-full size-[40px] min-w-[40px] flex-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M14.0774 14.0999L16.6441 16.6666M15.8333 9.58325C15.8333 11.2409 15.1748 12.8306 14.0027 14.0027C12.8306 15.1748 11.2409 15.8333 9.58325 15.8333C7.92565 15.8333 6.33594 15.1748 5.16383 14.0027C3.99173 12.8306 3.33325 11.2409 3.33325 9.58325C3.33325 7.92565 3.99173 6.33594 5.16383 5.16383C6.33594 3.99173 7.92565 3.33325 9.58325 3.33325C11.2409 3.33325 12.8306 3.99173 14.0027 5.16383C15.1748 6.33594 15.8333 7.92565 15.8333 9.58325Z"
            stroke="black"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ---------------------------- search input ---------------------------- */}
      <input
      value={searchQuery}
        type="text"
        placeholder={placeholderText}
        className="w-full h-full min-h-[40px] text-[17px] outline-none leading-normal 
                   placeholder:text-gray-200 placeholder:text-[14px]"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
