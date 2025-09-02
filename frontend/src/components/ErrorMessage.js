import React from 'react'

const ErrorMessage = ({ error }) => (
  <div className="w-full max-w-2xl mx-auto mt-8 sm:mt-12 px-4 sm:px-6">
    <div className="bg-red-900 bg-opacity-40 backdrop-blur-lg border border-red-700 border-opacity-50 rounded-2xl p-4 sm:p-6 text-center shadow-2xl">
      <div className="flex items-center justify-center mb-2">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-red-300 font-semibold text-sm sm:text-base">Oops!</span>
      </div>
      <p className="text-red-200 text-sm sm:text-base">
        {error || "No results found. Please check your spelling and try again."}
      </p>
    </div>
  </div>
)

export default ErrorMessage