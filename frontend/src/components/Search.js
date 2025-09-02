import React from 'react'

const Search = ({ onSearch, autocompleteResults, onInputChange, searchInput, setSearchInput }) => {
  const [hasSearched, setHasSearched] = React.useState(false)

  const handleSubmit = () => {
    if (searchInput.trim()) {
      setHasSearched(true)
      onSearch(searchInput.trim())
    }
  }

  const handleSelection = (selectedTrack) => {
    const searchTerm = `${selectedTrack.title} ${selectedTrack.artist}`
    setSearchInput(searchTerm)
    setHasSearched(true)
    onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchInput('')
    setHasSearched(false)
    onInputChange('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Close autocomplete when searching manually
      onInputChange('')
      handleSubmit()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value)
              onInputChange(e.target.value)
            }}
            onKeyPress={handleKeyPress}
            placeholder="Search for a song or artist... (Press Enter to search)"
            className="w-full px-4 sm:px-6 py-4 sm:py-5 text-base sm:text-lg rounded-2xl bg-gray-800 bg-opacity-60 backdrop-blur-lg border border-gray-600 border-opacity-50 shadow-2xl outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 focus:border-blue-400 text-white placeholder-gray-400 transition-all duration-200"
            autoComplete="off"
            required
          />
          
          {/* Search/Clear icon */}
          <div className="absolute right-4 sm:right-6 top-1/2 transform -translate-y-1/2">
            {hasSearched && searchInput ? (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-gray-700 hover:bg-opacity-50 rounded-full transition-all duration-200 group"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          
          {autocompleteResults.length > 0 && (
            <ul className="absolute top-full left-0 right-0 mt-2 bg-gray-800 bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-600 border-opacity-50 overflow-hidden z-10 max-h-80 overflow-y-auto">
              {autocompleteResults.map((item, index) => (
                <li 
                  key={index} 
                  onClick={() => handleSelection(item)}
                  className="flex items-center p-3 sm:p-4 hover:bg-gray-700 hover:bg-opacity-50 cursor-pointer transition-all duration-200 border-b border-gray-700 border-opacity-30 last:border-b-0"
                >
                  <img 
                    src={item.albumCover} 
                    alt={`${item.title} album cover`}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg mr-3 sm:mr-4 shadow-md flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm sm:text-base truncate">
                      {item.title}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm truncate">
                      {item.artist}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Search