import { useEffect, useState } from 'react'
import { getPlaylists } from '../api/playlist.api'
import PlaylistCard from '../components/PlaylistCard'
import '../App.css'

function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getPlaylists()
      .then((data) => { if (mounted) setPlaylists(data) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <>
 

      <section className="playlists-page">
        <header className="playlists-header">
          <h2>Playlists</h2>
          {!loading && (
            <span className="playlists-count">{playlists.length} playlists</span>
          )}
        </header>

        <div className="playlist-list">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div className="pl-skeleton" key={i}>
                  <div className="pl-skeleton-art" />
                  <div className="pl-skeleton-body">
                    <div className="pl-skeleton-line" style={{ width: '70%' }} />
                    <div className="pl-skeleton-line" style={{ width: '45%' }} />
                  </div>
                </div>
              ))
            : playlists.length
              ? playlists.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))
              : (
                  <div className="pl-empty">
                    <div className="pl-empty-icon">♪</div>
                    <p>No playlists found.</p>
                  </div>
                )
          }
        </div>
      </section>
    </>
  )
}

export default PlaylistsPage