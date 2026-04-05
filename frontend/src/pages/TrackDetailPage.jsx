import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { CalendarDays, Clock3, Play, Star, UserRound } from 'lucide-react'
import { getTrack, favoriteTrack, unfavoriteTrack } from '../api/track.api'
import { usePlayer } from '../contexts/PlayerContext'
import { formatDate, formatDuration } from '../utils/format'
import { toMediaUrl } from '../utils/media'
import { useHomeData } from '../state/useHomeData'

function TrackDetailPage() {
  const { id } = useParams()
  const trackId = Number(id)
  const { setQueueAndPlay } = usePlayer()
  const { favoriteTracks, tracks } = useHomeData()

  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [optimisticFavorite, setOptimisticFavorite] = useState(null)

  const isFavorite = useMemo(() => {
    if (optimisticFavorite != null) return optimisticFavorite
    return favoriteTracks.some((fav) => fav.id === trackId)
  }, [favoriteTracks, optimisticFavorite, trackId])

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getTrack(trackId)
        if (mounted) setTrack(data)
      } catch (err) {
        if (mounted) setError('Could not load track.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (!Number.isNaN(trackId)) {
      load()
    }

    return () => {
      mounted = false
    }
  }, [trackId])

  const handlePlay = () => {
    if (!track) return
    const queueSource = tracks.length ? tracks : [track]
    const indexInQueue = queueSource.findIndex((t) => t.id === track.id)
    setQueueAndPlay(queueSource, indexInQueue >= 0 ? indexInQueue : 0)
  }

  const handleFavoriteToggle = async () => {
    if (!track) return
    setOptimisticFavorite(!isFavorite)
    try {
      if (isFavorite) {
        await unfavoriteTrack(track.id)
      } else {
        await favoriteTrack(track.id)
      }
    } catch {
      setOptimisticFavorite(null)
    }
  }

  if (loading) {
    return (
      <section className="page-section">
        <p>Loading track...</p>
      </section>
    )
  }

  if (error || !track) {
    return (
      <section className="page-section">
        <p className="form-error">{error || 'Track not found.'}</p>
      </section>
    )
  }

  const heroImage = toMediaUrl(track.cover_image)

  return (
    <section className="page-section">
      <div className="track-hero">
        <img src={heroImage} alt={track.title} className="track-hero-image" />
        <div className="track-hero-info">
          <p className="eyebrow">Track</p>
          <h2>{track.title}</h2>
          <div className="track-hero-meta">
            <span>
              <UserRound size={14} />
              <Link to={`/artists/${track.artist}`}>{track.artist_name}</Link>
            </span>
            {track.album ? (
              <span>
                From <Link to={`/albums/${track.album}`}>{track.album_title}</Link>
              </span>
            ) : null}
            <span>
              <Clock3 size={14} />
              {formatDuration(track.duration)}
            </span>
            <span>
              <Star size={14} />
              {track.stats?.total_plays ?? track.play_count ?? 0} plays
            </span>
            <span>
              Weekly {track.stats?.weekly_plays ?? 0}
            </span>
            <span>
              Monthly {track.stats?.monthly_plays ?? 0}
            </span>
            {track.created_at ? (
              <span>
                <CalendarDays size={14} />
                Added {formatDate(track.created_at)}
              </span>
            ) : null}
          </div>

          <div className="track-hero-actions">
            <button type="button" className="primary-btn" onClick={handlePlay}>
              <Play size={16} /> Play
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? <FaHeart size={16} /> : <FaRegHeart size={16} />}
              {isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrackDetailPage
