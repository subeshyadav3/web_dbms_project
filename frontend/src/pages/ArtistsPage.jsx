import { useEffect, useState } from 'react'
import { getArtists } from '../api/artist.api'
import ArtistCard from '../components/ArtistCard'

function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getArtists()
      .then((data) => {
        if (mounted) {
          setArtists(data)
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
          <h2>Artists</h2>
          <p>Discover artist profiles, verification status, and catalog size.</p>
        </div>
        <span className="header-count">{artists.length} artists</span>
      </header>

      {loading ? <p>Loading artists...</p> : null}
      <div className="card-grid">
        {artists.length ? (
          artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)
        ) : (
          !loading && (
            <div className="empty-card">
              <p>No artists found.</p>
            </div>
          )
        )}
      </div>
    </section>
  )
}

export default ArtistsPage
