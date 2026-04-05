import { useEffect, useState } from 'react'
import { HeartCrack } from 'lucide-react'
import { getFavoriteTracks, unfavoriteTrack } from '../api/track.api'
import TrackCard from '../components/TrackCard'

function FavoritesPage() {
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setError('')
      setLoading(true)
      try {
        const data = await getFavoriteTracks()
        if (mounted) setTracks(data)
      } catch (err) {
        if (mounted) setError('Could not load favorites.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const handleRemove = async (trackId) => {
    try {
      await unfavoriteTrack(trackId)
      setTracks((prev) => prev.filter((t) => t.id !== trackId))
    } catch {
      // ignore
    }
  }

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <h2>Favorites</h2>
          <p>Your liked tracks with quick playback and stats.</p>
        </div>
        <span className="header-count">{tracks.length} tracks</span>
      </header>

      {loading ? <p>Loading favorites...</p> : null}
      {error ? <p className="form-error">{error}</p> : null}

      {!loading && !tracks.length ? (
        <div className="empty-card">
          <HeartCrack size={16} />
          <p>No favorites yet.</p>
        </div>
      ) : null}

      <div className="track-grid">
        {tracks.map((track, index) => (
          <div key={track.id} className="track-stack-card">
            <TrackCard track={track} tracks={tracks} index={index} />
            <button type="button" className="ghost-btn card-action-btn" onClick={() => handleRemove(track.id)}>
              Remove favorite
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FavoritesPage
