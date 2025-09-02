const LoadingSpinner = () => (
  <div className="flex items-center justify-center mt-8 sm:mt-12 px-4">
    <div className="bg-gray-900 bg-opacity-40 backdrop-blur-lg rounded-3xl p-6 sm:p-8 border border-gray-700 border-opacity-50 shadow-2xl">
      <div className="flex flex-col items-center">
        {/* Waveform Animation */}
        <div className="flex items-center justify-center h-12 sm:h-16 mb-4 space-x-1">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-full"
              style={{
                width: '4px',
                height: '32px',
                animation: `waveformBarCentered ${0.8 + (i % 3) * 0.2}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        
        <p className="text-white text-base sm:text-lg font-medium">Finding similar songs...</p>
        <p className="text-gray-400 text-sm mt-1">Searching through our music library</p>
      </div>
    </div>

    <style>{`
      @keyframes waveformBarCentered {
        0% { 
          transform: scaleY(0.2);
          opacity: 0.4; 
        }
        25% { 
          transform: scaleY(0.6);
          opacity: 0.7; 
        }
        50% { 
          transform: scaleY(1.2);
          opacity: 1; 
        }
        75% { 
          transform: scaleY(0.8);
          opacity: 0.8; 
        }
        100% { 
          transform: scaleY(0.4);
          opacity: 0.5; 
        }
      }
    `}</style>
  </div>
)

export default LoadingSpinner