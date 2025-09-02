// API service for handling all backend requests
const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:3001/api'

class ApiService {
  // Search for tracks
  static async searchTracks(query) {
    if (!query || query.trim() === '') {
      return { tracks: { items: [] } }
    }

    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=24`)
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }

    return await response.json()
  }

  // Get recommendations for a specific track ID
  static async getRecommendations(trackId, offset = 0) {
    if (!trackId) {
      throw new Error('Track ID is required')
    }

    const response = await fetch(`${API_BASE_URL}/recommendations?trackId=${trackId}&limit=24&offset=${offset}`)
    
    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return data
  }

  // Health check endpoint
  static async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`)
    return await response.json()
  }
}

export default ApiService