import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { CalendarDays, Clock3, Play, Star, UserRound, Music, UserPlus, UserCheck } from 'lucide-react'
import { getTrack, favoriteTrack, unfavoriteTrack } from '../api/track.api'
import { followUser, isFollowingUser, unfollowUser } from '../api/user.api'
import { usePlayer } from '../contexts/PlayerContext'
import { formatDate, formatDuration } from '../utils/format'
import { toMediaUrl } from '../utils/media'
import { useHomeData } from '../state/useHomeData'
import '../App.css'

function TrackDetailPage() {
  const { id } = useParams()
  const trackId = Number(id)
  const { setQueueAndPlay } = usePlayer()
  const { favoriteTracks, tracks } = useHomeData()

  const [track, setTrack] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [optimisticFavorite, setOptimisticFavorite] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)

  const isFavorite = useMemo(() => {
    if (optimisticFavorite != null) return optimisticFavorite
    return favoriteTracks.some((fav) => fav.id === trackId)
  }, [favoriteTracks, optimisticFavorite, trackId])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true); setError('')
      try {
        const data = await getTrack(trackId)
        if (!mounted) return
        setTrack(data)
        if (data.artist_user_id) {
          const following = await isFollowingUser(data.artist_user_id)
          if (mounted) setIsFollowing(following)
        }
      } catch {
        if (mounted) setError('Could not load track.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (!Number.isNaN(trackId)) load()
    return () => { mounted = false }
  }, [trackId])

  const handlePlay = () => {
    if (!track) return
    const queueSource = tracks.length ? tracks : [track]
    const idx = queueSource.findIndex((t) => t.id === track.id)
    setQueueAndPlay(queueSource, idx >= 0 ? idx : 0)
  }

  const handleFavoriteToggle = async () => {
    if (!track) return
    setOptimisticFavorite(!isFavorite)
    try {
      isFavorite ? await unfavoriteTrack(track.id) : await favoriteTrack(track.id)
    } catch {
      setOptimisticFavorite(null)
    }
  }

  const handleFollowToggle = async () => {
    if (!track?.artist_user_id) return
    try {
      if (isFollowing) { await unfollowUser(track.artist_user_id); setIsFollowing(false) }
      else { await followUser(track.artist_user_id); setIsFollowing(true) }
    } catch {}
  }

  if (loading) {
    return (
      <section className="tdetail-page">
        <div className="tdetail-skeleton">
          <div className="tdetail-skeleton__art" />
          <div className="tdetail-skeleton__body">
            {[80, 55, 40, 40, 60].map((w, i) => (
              <div key={i} className="tdetail-skeleton__line" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !track) {
    return (
      <section className="tdetail-page">
        <div className="fav-empty">
          <div className="fav-empty__icon"><Music size={22} /></div>
          <p>{error || 'Track not found.'}</p>
        </div>
      </section>
    )
  }

  const heroImage = toMediaUrl(track.cover_image)

  return (
    <section className="tdetail-page">
      <div className="tdetail-hero">

        <div className="tdetail-art">
          {heroImage
            ? <img src={heroImage} alt={track.title} className="tdetail-art__img" />
            : <div className="tdetail-art__fallback"><Music size={48} /></div>
          }
        </div>

        <div className="tdetail-info">
          <span className="tdetail-eyebrow">Track</span>
          <h2 className="tdetail-title">{track.title}</h2>

          <div className="tdetail-meta">
            <span className="tdetail-meta__item">
              <UserRound size={12} />
              <Link className="tdetail-link" to={`/artists/${track.artist}`}>{track.artist_name}</Link>
            </span>
            {track.album && (
              <span className="tdetail-meta__item">
                From <Link className="tdetail-link" to={`/albums/${track.album}`}>{track.album_title}</Link>
              </span>
            )}
            {track.created_at && (
              <span className="tdetail-meta__item tdetail-meta__item--muted">
                <CalendarDays size={11} />
                {formatDate(track.created_at)}
              </span>
            )}
          </div>

          <div className="tdetail-stats">
            <div className="tdetail-stat">
              <Clock3 size={12} />
              <span>{formatDuration(track.duration)}</span>
            </div>
            <div className="tdetail-stat-div" />
            <div className="tdetail-stat">
              <Star size={12} />
              <span>{track.stats?.total_plays ?? track.play_count ?? 0}</span>
              <small>plays</small>
            </div>
            <div className="tdetail-stat-div" />
            <div className="tdetail-stat">
              <span>{track.stats?.weekly_plays ?? 0}</span>
              <small>this week</small>
            </div>
            <div className="tdetail-stat-div" />
            <div className="tdetail-stat">
              <span>{track.stats?.monthly_plays ?? 0}</span>
              <small>this month</small>
            </div>
          </div>

          <div className="tdetail-actions">
            <button type="button" className="tdetail-play-btn" onClick={handlePlay}>
              <Play size={15} /> Play
            </button>
            <button
              type="button"
              className={`tdetail-fav-btn ${isFavorite ? 'tdetail-fav-btn--active' : ''}`}
              onClick={handleFavoriteToggle}
            >
              {isFavorite ? <FaHeart size={14} /> : <FaRegHeart size={14} />}
              {isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
            <button
              type="button"
              className={`tdetail-follow-btn ${isFollowing ? 'tdetail-follow-btn--active' : ''}`}
              onClick={handleFollowToggle}
            >
              {isFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrackDetailPage