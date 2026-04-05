import { useEffect, useState } from 'react'
import { getAlbums } from '../api/album.api'
import AlbumCard from '../components/AlbumCard'

function AlbumsPage() {
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getAlbums()
      .then((data) => {
        if (mounted) {
          setAlbums(data)
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
          <h2>Albums</h2>
          <p>Browse releases with visibility, track counts, and release dates.</p>
        </div>
        <span className="header-count">{albums.length} albums</span>
      </header>

      {loading ? <p>Loading albums...</p> : null}
      <div className="card-grid">
        {albums.length ? (
          albums.map((album) => <AlbumCard key={album.id} album={album} />)
        ) : (
          !loading && (
            <div className="empty-card">
              <p>No albums found.</p>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default AlbumsPage
