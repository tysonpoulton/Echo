import React, { useState, useMemo } from 'react'
import ParticleBackground from './components/ParticleBackground'
import Header from './components/Header'
import Search from './components/Search'
import Track from './components/Track'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorMessage from './components/ErrorMessage'
import ApiService from './services/api'

const App = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [autocompleteResults, setAutocompleteResults] = useState([])
  const [searchResult, setSearchResult] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [debounceTimer, setDebounceTimer] = useState(null)
  const [currentTrackId, setCurrentTrackId] = useState(null)
  const [hasMoreResults, setHasMoreResults] = useState(true)
  const [offset, setOffset] = useState(0)

  // Function to search for track and get recommendations
  const search = async (searchTerm) => {
    setLoading(true)
    setError(null)
    setAutocompleteResults([])
    setRecommendations([])
    setOffset(0)
    setHasMoreResults(true)

    try {
      // First, search for the track
      const searchData = await ApiService.searchTracks(searchTerm)
      
      if (!searchData.tracks?.items?.length) {
        throw new Error('No tracks found')
      }

      const firstTrack = searchData.tracks.items[0]
      setCurrentTrackId(firstTrack.id)
      
      // Get initial recommendations for this track
      const recData = await ApiService.getRecommendations(firstTrack.id, 0)

      setSearchResult(`${recData.track.name} by ${recData.track.artist}`)
      setRecommendations(recData.recommendations || [])
      
      // Use the hasMore field from the backend response
      setHasMoreResults(recData.hasMore !== false)
      setOffset(24) // Set offset for next load

    } catch (err) {
      console.error('Error searching:', err)
      setError(err.message)
      setRecommendations([])
      setHasMoreResults(false)
    } finally {
      setLoading(false)
    }
  }

  // Function to load more recommendations
  const loadMoreRecommendations = async () => {
    if (!currentTrackId || isLoadingMore) return

    setIsLoadingMore(true)
    setError(null)

    try {
      const recData = await ApiService.getRecommendations(currentTrackId, offset)
      
      if (!recData.recommendations || recData.recommendations.length === 0) {
        setHasMoreResults(false)
      } else {
        setRecommendations(prev => [...prev, ...recData.recommendations])
        
        // Use the hasMore field from the backend response
        setHasMoreResults(recData.hasMore !== false)
        setOffset(prev => prev + 24)
      }

    } catch (err) {
      console.error('Error loading more:', err)
      setError(err.message)
      setHasMoreResults(false)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Function to handle autocomplete input with debouncing
  const handleInputChange = async (input) => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    // Set new timer
    const newTimer = setTimeout(async () => {
      if (input.trim() === '') {
        setAutocompleteResults([])
        return
      }

      try {
        const data = await ApiService.searchTracks(input)
        const results = data.tracks?.items?.slice(0, 5).map(item => ({
          title: item.name,
          artist: item.artists[0].name,
          albumCover: item.album.images[2]?.url || item.album.images[1]?.url || item.album.images[0]?.url
        })) || []
        
        setAutocompleteResults(results)
      } catch (err) {
        console.error('Autocomplete error:', err)
      }
    }, 300) // 300ms debounce

    setDebounceTimer(newTimer)
  }

  // Memoize ParticleBackground for performance
  const particleBackground = useMemo(() => <ParticleBackground />, [])

  return (
    <div className="min-h-screen">
      {particleBackground}
      <div className="relative z-10 pb-8 sm:pb-12">
        <Header />
        <div className="container mx-auto">
          <Search 
            onSearch={search}
            autocompleteResults={autocompleteResults}
            onInputChange={handleInputChange}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
          />
          
          {loading && <LoadingSpinner />}
          {error && <ErrorMessage error={error} />}
          {!loading && !error && (
            <Track 
              recommendations={recommendations} 
              searchResult={searchResult}
              onLoadMore={loadMoreRecommendations}
              isLoadingMore={isLoadingMore}
              hasMoreResults={hasMoreResults}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App