import { useState, useEffect, useCallback } from 'react'
import { Loader } from '@googlemaps/js-api-loader'
import RestaurantCard from './components/RestaurantCard'
import './App.css'

function App() {
  const [location, setLocation] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurants, setSelectedRestaurants] = useState([])
  const [numberOfRestaurants, setNumberOfRestaurants] = useState(3)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [locationPermission, setLocationPermission] = useState('prompt')
  const [map, setMap] = useState(null)
  const [placesService, setPlacesService] = useState(null)
  const [apiReady, setApiReady] = useState(false)

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = async () => {
      try {
        // Replace with your Google Maps API key
        const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE'

        const loader = new Loader({
          apiKey: API_KEY,
          version: 'weekly',
          libraries: ['places']
        })

        await loader.load()

        // Create a temporary map for PlacesService
        const tempMap = new google.maps.Map(document.createElement('div'))
        const service = new google.maps.places.PlacesService(tempMap)

        setMap(tempMap)
        setPlacesService(service)
        setApiReady(true)
      } catch (err) {
        setError('無法載入 Google Maps API，請確認 API 金鑰是否正確設定')
        console.error('Maps initialization error:', err)
      }
    }

    initializeMap()
  }, [])

  // Search nearby restaurants using Places API
  const searchNearbyRestaurants = useCallback((userLocation) => {
    if (!placesService) {
      setError('地圖服務尚未準備好，請稍後再試')
      setLoading(false)
      return
    }

    const request = {
      location: new google.maps.LatLng(userLocation.lat, userLocation.lng),
      radius: 1500, // 1.5 km radius
      type: 'restaurant'
    }

    placesService.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // Process and enrich restaurant data
        const processedRestaurants = results.map(place => ({
          id: place.place_id,
          name: place.name,
          rating: place.rating || 0,
          userRatingsTotal: place.user_ratings_total || 0,
          vicinity: place.vicinity,
          photos: place.photos || [],
          geometry: place.geometry,
          openNow: place.opening_hours?.open_now,
          priceLevel: place.price_level,
          types: place.types
        }))

        setRestaurants(processedRestaurants)
        setLoading(false)
      } else {
        setError('無法搜尋附近餐廳，請稍後再試')
        setLoading(false)
        console.error('Places search error:', status)
      }
    })
  }, [placesService])

  // Get user location
  const getUserLocation = useCallback(() => {
    setLoading(true)
    setError(null)

    if (!navigator.geolocation) {
      setError('您的瀏覽器不支援定位功能')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        setLocation(userLocation)
        setLocationPermission('granted')
        searchNearbyRestaurants(userLocation)
      },
      (error) => {
        setLocationPermission('denied')
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('請允許瀏覽器存取您的位置資訊')
            break
          case error.POSITION_UNAVAILABLE:
            setError('無法取得位置資訊')
            break
          case error.TIMEOUT:
            setError('取得位置資訊逾時，請重試')
            break
          default:
            setError('發生未知錯誤')
        }
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }, [searchNearbyRestaurants])

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1, lng1, lat2, lng2) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return distance.toFixed(2)
  }, [])

  // Randomly select n restaurants
  const selectRandomRestaurants = useCallback(() => {
    if (restaurants.length === 0) {
      setError('沒有找到附近的餐廳')
      return
    }

    const n = Math.min(numberOfRestaurants, restaurants.length)
    const shuffled = [...restaurants].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, n)

    // Add distance information to selected restaurants
    const enrichedRestaurants = selected.map(restaurant => ({
      ...restaurant,
      distance: location ? calculateDistance(
        location.lat,
        location.lng,
        restaurant.geometry.location.lat(),
        restaurant.geometry.location.lng()
      ) : null
    }))

    setSelectedRestaurants(enrichedRestaurants)
  }, [restaurants, numberOfRestaurants, location, calculateDistance])

  // Request location on mount
  useEffect(() => {
    if (apiReady && !location) {
      getUserLocation()
    }
  }, [apiReady, location, getUserLocation])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🍽️ 晚餐選擇器</h1>
        <p>讓我們幫你決定今天要吃什麼！</p>
      </header>

      <main className="app-main">
        {!apiReady && !error && (
          <div className="loading">
            <div className="spinner"></div>
            <p>正在載入地圖服務...</p>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
            {(locationPermission === 'denied' || !apiReady) && (
              <button onClick={getUserLocation}>重試</button>
            )}
          </div>
        )}

        {apiReady && loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>正在搜尋附近餐廳...</p>
          </div>
        )}

        {!loading && location && restaurants.length > 0 && (
          <div className="controls">
            <div className="input-group">
              <label htmlFor="restaurant-count">推薦餐廳數量：</label>
              <input
                id="restaurant-count"
                type="number"
                min="1"
                max="10"
                value={numberOfRestaurants}
                onChange={(e) => setNumberOfRestaurants(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
              />
            </div>
            <button
              className="show-restaurants-btn"
              onClick={selectRandomRestaurants}
            >
              {selectedRestaurants.length > 0 ? '重新推薦' : '顯示餐廳'}
            </button>
          </div>
        )}

        {selectedRestaurants.length > 0 && (
          <div className="restaurants-grid">
            {selectedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        )}

        {!loading && !error && location && restaurants.length === 0 && (
          <div className="no-results">
            <p>附近沒有找到餐廳，請稍後再試</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
