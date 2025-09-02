const Header = () => {
  return (
    <div className="w-full flex items-center justify-center flex-col text-center pt-12 sm:pt-20 pb-8 sm:pb-12 px-4">
      <div className="bg-gray-900 bg-opacity-40 backdrop-blur-lg border border-gray-700 border-opacity-50 rounded-3xl p-6 sm:p-8 shadow-2xl max-w-4xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-wide">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Echo</span>
        </h1>
        <h4 className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Discover your next favorite song. Enter any track and we'll find similar music you'll love.
        </h4>
      </div>
    </div>
  )
}

export default Header