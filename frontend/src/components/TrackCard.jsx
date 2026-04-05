import { Clock3, Play, Star, UserRound, Calendar } from 'lucide-react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../contexts/PlayerContext'
import { useState } from 'react'
import { favoriteTrack, unfavoriteTrack } from '../api/track.api'
import { useHomeData } from '../state/useHomeData'
import { formatDuration, formatDate } from '../utils/format'
import { Music } from 'lucide-react'
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
    <article className="track-card" onClick={() => navigate(`/tracks/${track.id}`)}>
      <div className="track-image">
        {/* {track.cover_image ? (
    <img
      src={track.cover_image}
      alt={track.title}
      className="cover-img"
    />
  ) : (
    <div className="cover-placeholder">
      <Music size={32} />
    </div>
  )} */}
        <Music size={32} />
      </div>

      <div className="track-head">
        <h4>{track.title}</h4>
        <button
          type="button"
          className="icon-btn"
          onClick={(event) => {
            event.stopPropagation()
            setQueueAndPlay(tracks, index)
          }}
        >
          <Play size={16} />
        </button>
      </div>

      <div className="track-meta">
        <span>
          <UserRound size={14} />
          {track.artist_name || 'Unknown Artist'}
        </span>

        {track.album_title && (
          <span>
            Album: {track.album_title}
          </span>
        )}

        {track.genre && (
          <span>
            Genre: {track.genre}
          </span>
        )}

        {track.release_date && (
          <span>
            <Calendar size={14} />
            {formatDate(track.release_date)}
          </span>
        )}

        <span>
          <Clock3 size={14} />
          {formatDuration(track.duration)}
        </span>

        <span>
          <Star size={14} />
          {track.stats?.total_plays ?? 0} plays
        </span>

        {track.stats?.weekly_plays != null && (
          <span>
            Weekly: {track.stats.weekly_plays}
          </span>
        )}

        {track.stats?.monthly_plays != null && (
          <span>
            Monthly: {track.stats.monthly_plays}
          </span>
        )}

        <button
          type="button"
          className="icon-btn"
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
          onClick={handleFavoriteToggle}
        >
          {isFavorite ? <FaHeart size={16} color="red" /> : <FaRegHeart size={16} />}
        </button>
      </div>
    </article>
  )
}

export default TrackCard