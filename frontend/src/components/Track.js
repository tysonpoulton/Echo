import { useState, useEffect, useRef } from 'react'

const Track = ({ recommendations, searchResult, onLoadMore, isLoadingMore, hasMoreResults }) => {
  const [visibleItems, setVisibleItems] = useState([])
  const containerRef = useRef(null)
  const trackRefs = useRef([])

  useEffect(() => {
    if (recommendations.length === 0) {
      setVisibleItems([])
      return
    }

    // Reset visible items when new recommendations come in
    setVisibleItems([])
    trackRefs.current = []

    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleItems(prev => {
              if (!prev.includes(index)) {
                return [...prev, index].sort((a, b) => a - b)
              }
              return prev
            })
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -100px 0px'
      }
    )

    // Observe each track element after a short delay to ensure they're rendered
    setTimeout(() => {
      trackRefs.current.forEach((ref) => {
        if (ref) observer.observe(ref)
      })
    }, 100)

    return () => {
      observer.disconnect()
    }
  }, [recommendations])

  if (recommendations.length === 0) return null

  return (
    <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12">
      {searchResult && (
        <div className="text-center mb-6 sm:mb-8">
          <div 
            className="relative inline-block"
            style={{ 
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-white bg-gray-900 bg-opacity-50 backdrop-blur-xl rounded-2xl py-3 sm:py-4 px-4 sm:px-8 border border-gray-600 border-opacity-40 shadow-xl relative overflow-hidden">
              <span className="relative z-10">
                Songs similar to <span className="text-blue-400 font-bold">{searchResult}</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
            </h2>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
        {recommendations.map((track, index) => (
          <a
            key={`${index}-${track.id}`}
            ref={el => trackRefs.current[index] = el}
            data-index={index}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className={`group bg-gray-800 bg-opacity-40 backdrop-blur-lg border border-gray-700 border-opacity-50 rounded-2xl p-3 sm:p-4 hover:bg-opacity-60 hover:border-blue-400 hover:border-opacity-50 transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl block relative overflow-hidden ${
              visibleItems.includes(index) ? 'animate-slideInUp opacity-100' : 'opacity-0 translate-y-8'
            }`}
            style={{
              transform: visibleItems.includes(index) ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
              opacity: visibleItems.includes(index) ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: visibleItems.includes(index) ? `${(index % 6) * 100}ms` : '0ms'
            }}
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-400 rounded-2xl"></div>
            
            <div className="relative z-10">
              <div className="relative overflow-hidden rounded-xl mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-400">
                <img 
                  src={track.album.images[1]?.url || track.album.images[0]?.url} 
                  alt={`${track.name} Album Cover`}
                  className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-400"></div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transform transition-transform duration-200 hover:scale-110">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-800 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-white text-xs sm:text-sm mb-1 line-clamp-2 leading-tight group-hover:text-blue-300 transition-colors duration-300">
                  {track.name}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-1 group-hover:text-gray-300 transition-colors duration-300">
                  {track.artists[0].name}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreResults && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:ring-4 focus:ring-blue-400 focus:ring-opacity-30 text-base sm:text-lg overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              {isLoadingMore ? (
                <>
                  <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading more...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  Load More Songs
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </button>
        </div>
      )}

      {/* No more results message */}
      {!hasMoreResults && recommendations.length > 0 && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <div className="bg-gray-900 bg-opacity-50 backdrop-blur-xl border border-gray-600 border-opacity-40 rounded-2xl p-4 sm:p-6 text-center shadow-xl">
            <div className="flex items-center justify-center mb-2">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-300 font-semibold text-sm sm:text-base">That's all!</span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base">
              No more similar songs found. Try searching for a different track!
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  )
}

export default Track