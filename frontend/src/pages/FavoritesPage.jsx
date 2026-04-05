import { useEffect, useState } from 'react'
import { HeartCrack, X } from 'lucide-react'
import { getFavoriteTracks, unfavoriteTrack } from '../api/track.api'
import TrackCard from '../components/TrackCard'
import '../App.css'

function FavoritesPage() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setError(''); setLoading(true)
      try {
        const data = await getFavoriteTracks()
        if (mounted) setTracks(data)
      } catch {
        if (mounted) setError('Could not load favorites.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleRemove = async (trackId) => {
    setRemoving(trackId)
    try {
      await unfavoriteTrack(trackId)
      setTracks((prev) => prev.filter((t) => t.id !== trackId))
    } catch {
      // ignore
    } finally {
      setRemoving(null)
    }
  }

  return (
    <section className="favorites-page">
      <header className="favorites-page__header">
        <h2>Favorites</h2>
        {!loading && (
          <span className="favorites-page__count">{tracks.length} tracks</span>
        )}
      </header>

      {error && (
        <div className="favorites-page__error">
          <span className="manage-toast__dot" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="fav-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="fav-skeleton" key={i}>
              <div className="fav-skeleton__art" />
              <div className="fav-skeleton__body">
                <div className="fav-skeleton__line" style={{ width: '65%' }} />
                <div className="fav-skeleton__line" style={{ width: '40%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : !tracks.length ? (
        <div className="fav-empty">
          <div className="fav-empty__icon"><HeartCrack size={22} /></div>
          <p>No favorites yet.</p>
        </div>
      ) : (
        <div className="fav-grid">
          {tracks.map((track, index) => (
            <div key={track.id} className={`fav-item ${removing === track.id ? 'fav-item--removing' : ''}`}>
              <TrackCard track={track} tracks={tracks} index={index} />
              <button
                type="button"
                className="fav-remove-btn"
                onClick={() => handleRemove(track.id)}
                disabled={removing === track.id}
                aria-label="Remove from favorites"
              >
                <X size={12} />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default FavoritesPage