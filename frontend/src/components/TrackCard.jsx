import { Clock3, Play, Star, UserRound, Calendar } from 'lucide-react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../contexts/PlayerContext'
import { useState } from 'react'
import { favoriteTrack, unfavoriteTrack } from '../api/track.api'
import { useHomeData } from '../state/useHomeData'
import { formatDuration, formatDate } from '../utils/format'
import { Music } from 'lucide-react'
import '../App.css'

function TrackCard({ track, tracks = [], index = 0 }) {
  const { setQueueAndPlay } = usePlayer()
  const navigate = useNavigate()
  const { favoriteTracks, updateFavorites } = useHomeData()
  const [optimisticFavorite, setOptimisticFavorite] = useState(null)

  const isFavorite = optimisticFavorite != null
    ? optimisticFavorite
    : favoriteTracks.some((fav) => fav.id === track.id)

  const handleFavoriteToggle = async (event) => {
    event.stopPropagation()
    setOptimisticFavorite(!isFavorite)
    try {
      if (isFavorite) {
        await unfavoriteTrack(track.id)
      } else {
        await favoriteTrack(track.id)
      }
      updateFavorites()
    } catch {
      setOptimisticFavorite(null)
    }
  }

  return (
    <>
     

      <article
        className="track-card"
        onClick={() => navigate(`/tracks/${track.id}`)}
      >
        {/* Artwork */}
        <div className="tc-artwork-wrap">
          <div className="track-artwork">
            <Music />
          </div>

          {/* Play overlay */}
          <div className="play-overlay">
            <button
              type="button"
              className="play-btn-large"
              onClick={(e) => {
                e.stopPropagation()
                setQueueAndPlay(tracks, index)
              }}
            >
              <Play size={18} />
            </button>
          </div>

          {/* Favorite */}
          <button
            type="button"
            className="fav-btn"
            aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
            onClick={handleFavoriteToggle}
          >
            {isFavorite
              ? <FaHeart size={13} color="#ff4466" />
              : <FaRegHeart size={13} color="#6e6e88" />}
          </button>
        </div>

        {/* Body */}
        <div className="tc-body">
          <h4 className="tc-title">{track.title}</h4>
          <p className="tc-artist">
            <UserRound size={11} />
            {track.artist_name || 'Unknown Artist'}
          </p>

          {/* Tags */}
          <div className="tc-tags">
            {track.album_title && (
              <span className="tc-tag">{track.album_title}</span>
            )}
            {track.genre && (
              <span className="tc-tag">{track.genre}</span>
            )}
            {track.release_date && (
              <span className="tc-tag">{formatDate(track.release_date)}</span>
            )}
          </div>

          {/* Stats */}
          <div className="tc-stats">
            <span className="tc-stat">
              <Clock3 size={10} />
              {formatDuration(track.duration)}
            </span>
            <div className="tc-divider" />
            <span className="tc-stat">
              <Star size={10} />
              {track.stats?.total_plays ?? 0}
            </span>
            {track.stats?.weekly_plays != null && (
              <>
                <div className="tc-divider" />
                <span className="tc-stat">{track.stats.weekly_plays}w</span>
              </>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

export default TrackCard