const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: "https://echo-recommendations.onrender.com"
}));
app.use(express.json());

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, LASTFM_API_KEY } = process.env;

let accessToken = null;
let tokenExpiry = null;

const getAccessToken = async () => {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) return accessToken;

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
    },
    body: 'grant_type=client_credentials'
  };

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const data = await response.json();
    
    if (!data.access_token) throw new Error(data.error_description || data.error);
    
    accessToken = data.access_token;
    tokenExpiry = Date.now() + (data.expires_in * 1000);
    return accessToken;
  } catch (error) {
    console.error('Token fetch error:', error);
    throw error;
  }
};

app.get('/api/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) return res.json({ tracks: { items: [] } });

    const token = await getAccessToken();
    const searchResponse = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=5`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );

    if (!searchResponse.ok) throw new Error(`Spotify API error: ${searchResponse.status}`);
    
    res.json(await searchResponse.json());
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/recommendations', async (req, res) => {
  try {
    const { trackId, offset = 0, limit = 24 } = req.query;
    if (!trackId) return res.status(400).json({ error: 'Track ID required' });

    const token = await getAccessToken();
    const offsetNum = parseInt(offset);
    const limitNum = parseInt(limit);
    
    // Get track details
    const trackResponse = await fetch(
      `https://api.spotify.com/v1/tracks/${trackId}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    if (!trackResponse.ok) throw new Error(`Track fetch failed: ${trackResponse.status}`);
    
    const track = await trackResponse.json();
    const artist = track.artists[0].name;
    
    // Get more similar tracks from Last.fm to account for pagination
    // Request more tracks than we need since some won't be found on Spotify
    const lastfmLimit = Math.max(50, (offsetNum + limitNum) * 2);
    const lastfmUrl = `http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track.name)}&api_key=${LASTFM_API_KEY}&format=json&limit=${lastfmLimit}`;
    const lastfmResponse = await fetch(lastfmUrl);
    
    if (!lastfmResponse.ok) throw new Error(`Last.fm API error: ${lastfmResponse.status}`);
    
    const lastfmData = await lastfmResponse.json();
    if (lastfmData.error) throw new Error(`Last.fm error: ${lastfmData.message}`);
    
    // Find similar tracks on Spotify
    const similarTracks = lastfmData.similartracks?.track || [];
    const spotifyRecommendations = [];
    
    // Process tracks starting from the offset
    let processed = 0;
    let found = 0;
    
    for (let i = 0; i < similarTracks.length && found < (offsetNum + limitNum); i++) {
      const similarTrack = similarTracks[i];
      try {
        const searchQuery = `track:"${similarTrack.name}" artist:"${similarTrack.artist.name}"`;
        const searchResponse = await fetch(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=1`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        if (searchResponse.ok) {
          const searchData = await searchResponse.json();
          if (searchData.tracks.items[0]) {
            // Only include tracks that fall within our pagination window
            if (processed >= offsetNum) {
              spotifyRecommendations.push(searchData.tracks.items[0]);
              found++;
            }
            processed++;
          }
        }
      } catch (error) {
        console.log('Spotify search failed for:', similarTrack.name);
      }
    }
    
    // Only return the tracks for this specific page
    const pageRecommendations = spotifyRecommendations.slice(0, limitNum);
    
    res.json({
      track: { id: track.id, name: track.name, artist },
      recommendations: pageRecommendations,
      hasMore: processed < similarTracks.length && spotifyRecommendations.length === limitNum
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});