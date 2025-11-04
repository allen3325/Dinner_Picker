import { useState } from 'react'
import './RestaurantCard.css'

function RestaurantCard({ restaurant }) {
  const [imageError, setImageError] = useState(false)

  // Get photo URL from Google Places
  const getPhotoUrl = () => {
    if (restaurant.photos && restaurant.photos.length > 0) {
      return restaurant.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })
    }
    return null
  }

  // Handle opening restaurant in Google Maps
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/place/?q=place_id:${restaurant.id}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const photoUrl = getPhotoUrl()

  return (
    <div className="restaurant-card" onClick={openInGoogleMaps}>
      <div className="restaurant-image">
        {photoUrl && !imageError ? (
          <img
            src={photoUrl}
            alt={restaurant.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="placeholder-image">
            <span>🍴</span>
            <p>暫無照片</p>
          </div>
        )}
      </div>

      <div className="restaurant-info">
        <h3 className="restaurant-name">{restaurant.name}</h3>

        <div className="restaurant-rating">
          {restaurant.rating > 0 ? (
            <>
              <span className="stars">{'⭐'.repeat(Math.round(restaurant.rating))}</span>
              <span className="rating-text">
                {restaurant.rating.toFixed(1)} ({restaurant.userRatingsTotal} 則評論)
              </span>
            </>
          ) : (
            <span className="rating-text">尚無評分</span>
          )}
        </div>

        <div className="restaurant-details">
          <div className="detail-item">
            <span className="icon">📍</span>
            <span className="text">{restaurant.vicinity}</span>
          </div>

          {restaurant.distance && (
            <div className="detail-item">
              <span className="icon">🚶</span>
              <span className="text">{restaurant.distance} 公里</span>
            </div>
          )}

          {restaurant.openNow !== undefined && (
            <div className="detail-item">
              <span className="icon">🕐</span>
              <span className={`status ${restaurant.openNow ? 'open' : 'closed'}`}>
                {restaurant.openNow ? '營業中' : '已打烊'}
              </span>
            </div>
          )}

          {restaurant.priceLevel !== undefined && (
            <div className="detail-item">
              <span className="icon">💰</span>
              <span className="text">{'$'.repeat(restaurant.priceLevel)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-footer">
        <span className="click-hint">點擊查看 Google 地圖 →</span>
      </div>
    </div>
  )
}

export default RestaurantCard
