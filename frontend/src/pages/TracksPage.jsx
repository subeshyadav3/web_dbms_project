import { useMemo, useState } from 'react'
import { ListMusic, Search } from 'lucide-react'
import TrackCard from '../components/TrackCard'
import { useHomeData } from '../state/useHomeData'

function TracksPage() {
  const { tracks, loading } = useHomeData()
  const [search, setSearch] = useState('')

  const filteredTracks = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return tracks
    }

    return tracks.filter((track) => {
      const title = track.title?.toLowerCase() || ''
      const artist = track.artist_name?.toLowerCase() || ''
      const album = track.album_title?.toLowerCase() || ''
      return title.includes(query) || artist.includes(query) || album.includes(query)
    })
  }, [tracks, search])

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <h2>Tracks</h2>
          <p>Browse all tracks in your music catalog.</p>
        </div>
        <label className="search-box">
          <Search size={16} />
          <input
            type="search"
            placeholder="Search by title, artist or album"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </header>

      <div className="section-title all-tracks-title">
        <h3>
          <ListMusic size={16} />
          All tracks
        </h3>
        <span>{filteredTracks.length} songs</span>
      </div>

      {loading ? <p>Loading tracks...</p> : null}

      {!loading ? (
        <div className="track-grid">
          {filteredTracks.length ? (
            filteredTracks.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                tracks={filteredTracks}
                index={index}
              />
            ))
          ) : (
            <div className="empty-card">
              <p>No tracks matched your search.</p>
            </div>
          )}
        </div>
      ) : null}
    </section>
  )
}

export default TracksPage
