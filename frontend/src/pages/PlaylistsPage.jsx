import { useEffect, useState } from 'react'
import { getPlaylists } from '../api/playlist.api'
import PlaylistCard from '../components/PlaylistCard'

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getPlaylists()
      .then((data) => {
        if (mounted) {
          setPlaylists(data)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false)
        }
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <h2>Playlists</h2>
          <p>Explore personal and public playlists from your platform users.</p>
        </div>
        <span className="header-count">{playlists.length} playlists</span>
      </header>

      {loading ? <p>Loading playlists...</p> : null}

      <div className="playlist-list">
        {playlists.length ? (
          playlists.map((playlist) => <PlaylistCard key={playlist.id} playlist={playlist} />)
        ) : (
          !loading && (
            <div className="empty-card">
              <p>No playlists found.</p>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default PlaylistsPage
