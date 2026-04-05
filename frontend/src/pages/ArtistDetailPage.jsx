import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BadgeCheck, MapPin, Music2, Users, UserPlus, UserCheck, Disc3 } from 'lucide-react'
import { getArtist } from '../api/artist.api'
import { followUser, isFollowingUser, unfollowUser } from '../api/user.api'
import { useHomeData } from '../state/useHomeData'
import '../App.css'

function ArtistDetailPage() {
  const { id } = useParams()
  const artistId = Number(id)
  const { tracks, albums } = useHomeData()

  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)

  const artistTracks = useMemo(() => tracks.filter((t) => t.artist === artistId), [tracks, artistId])
  const artistAlbums = useMemo(() => albums.filter((a) => a.artist === artistId), [albums, artistId])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true); setError('')
      try {
        const data = await getArtist(artistId)
        if (!mounted) return
        setArtist(data)
        if (data.user?.id) {
          const following = await isFollowingUser(data.user.id)
          if (mounted) setIsFollowing(following)
        }
      } catch {
        if (mounted) setError('Could not load artist.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (!Number.isNaN(artistId)) load()
    return () => { mounted = false }
  }, [artistId])

  const handleFollowToggle = async () => {
    if (!artist?.user?.id) return
    try {
      if (isFollowing) { await unfollowUser(artist.user.id); setIsFollowing(false) }
      else { await followUser(artist.user.id); setIsFollowing(true) }
    } catch {}
  }

  if (loading) {
    return (
      <section className="artist-page">
        <div className="tdetail-skeleton">
          <div className="tdetail-skeleton__art" style={{ borderRadius: '50%', width: 160, height: 160 }} />
          <div className="tdetail-skeleton__body">
            {[60, 40, 80, 50].map((w, i) => (
              <div key={i} className="tdetail-skeleton__line" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !artist) {
    return (
      <section className="artist-page">
        <div className="fav-empty">
          <div className="fav-empty__icon"><Users size={22} /></div>
          <p>{error || 'Artist not found.'}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="artist-page">

      {/* Hero */}
      <div className="artist-hero">
        <div className="artist-avatar">
          {artist.profile_image
            ? <img src={artist.profile_image} alt={artist.stage_name} className="artist-avatar__img" />
            : <div className="artist-avatar__fallback"><Users size={40} /></div>
          }
        </div>

        <div className="artist-hero__info">
          <div className="artist-hero__top">
            <span className="tdetail-eyebrow">Artist</span>
            {artist.verified && (
              <span className="artist-verified"><BadgeCheck size={12} /> Verified</span>
            )}
          </div>
          <h2 className="artist-name">{artist.stage_name}</h2>

          {artist.description && (
            <p className="artist-bio">{artist.description}</p>
          )}

          <div className="tdetail-meta" style={{ marginTop: 4 }}>
            {artist.country && (
              <span className="tdetail-meta__item">
                <MapPin size={11} /> {artist.country}
              </span>
            )}
            <span className="tdetail-meta__item">
              <Users size={11} /> {artist.user?.followers_count ?? 0} followers
            </span>
          </div>

          <div className="tdetail-actions" style={{ marginTop: 4 }}>
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

      {/* Tracks */}
      <div className="artist-section">
        <div className="artist-section__head">
          <Music2 size={14} />
          <h3>Tracks</h3>
          <span className="artist-section__count">{artistTracks.length}</span>
        </div>
        {artistTracks.length ? (
          <ul className="artist-list">
            {artistTracks.map((track, i) => (
              <li key={track.id} className="artist-list__item">
                <span className="artist-list__num">{String(i + 1).padStart(2, '0')}</span>
                <Link className="artist-list__link" to={`/tracks/${track.id}`}>{track.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="artist-empty">No tracks yet.</p>
        )}
      </div>

      {/* Albums */}
      <div className="artist-section">
        <div className="artist-section__head">
          <Disc3 size={14} />
          <h3>Albums</h3>
          <span className="artist-section__count">{artistAlbums.length}</span>
        </div>
        {artistAlbums.length ? (
          <ul className="artist-list">
            {artistAlbums.map((album, i) => (
              <li key={album.id} className="artist-list__item">
                <span className="artist-list__num">{String(i + 1).padStart(2, '0')}</span>
                <Link className="artist-list__link" to={`/albums/${album.id}`}>{album.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="artist-empty">No albums yet.</p>
        )}
      </div>

    </section>
  )
}

export default ArtistDetailPage