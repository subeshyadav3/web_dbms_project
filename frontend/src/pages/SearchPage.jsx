import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import TrackCard from '../components/TrackCard'
import { useHomeData } from '../state/useHomeData'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = (searchParams.get('q') || '').toLowerCase().trim()
  const { tracks } = useHomeData()

  const filteredTracks = useMemo(() => {
    if (!query) {
      return []
    }

    return tracks.filter((track) => {
      const title = track.title?.toLowerCase() || ''
      const artist = track.artist_name?.toLowerCase() || ''
      const album = track.album_title?.toLowerCase() || ''
      return title.includes(query) || artist.includes(query) || album.includes(query)
    })
  }, [query, tracks])

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <h2>Search</h2>
          <p>Results for "{query || '...'}"</p>
        </div>
        {query ? <span className="header-count">{filteredTracks.length} matches</span> : null}
      </header>

      <div className="track-grid">
        {filteredTracks.map((track, index) => (
          <TrackCard key={track.id} track={track} tracks={filteredTracks} index={index} />
        ))}
      </div>

      {query && filteredTracks.length === 0 ? (
        <div className="empty-card">
          <p>No tracks matched your search. Try artist or album names too.</p>
        </div>
      ) : null}

      {!query ? (
        <div className="empty-card">
          <p>Start typing in the top search bar to find tracks, artists, and albums.</p>
        </div>
      ) : null}
    </section>
  )
}

export default SearchPage
