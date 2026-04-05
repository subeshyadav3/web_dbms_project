import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CalendarDays, Disc3, Eye, Music2 } from 'lucide-react'
import { getAlbum } from '../api/album.api'
import { useHomeData } from '../state/useHomeData'
import { formatDate } from '../utils/format'
import { toMediaUrl } from '../utils/media'

function AlbumDetailPage() {
  const { id } = useParams()
  const albumId = Number(id)
  const { tracks } = useHomeData()

  const [album, setAlbum] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const albumTracks = useMemo(
    () => tracks.filter((track) => track.album === albumId),
    [tracks, albumId],
  )

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getAlbum(albumId)
        if (mounted) setAlbum(data)
      } catch (err) {
        if (mounted) setError('Could not load album.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (!Number.isNaN(albumId)) {
      load()
    }

    return () => {
      mounted = false
    }
  }, [albumId])

  if (loading) {
    return (
      <section className="page-section">
        <p>Loading album...</p>
      </section>
    )
  }

  if (error || !album) {
    return (
      <section className="page-section">
        <p className="form-error">{error || 'Album not found.'}</p>
      </section>
    )
  }

  return (
    <section className="page-section">
      <header className="detail-header-card">
        <img src={toMediaUrl(album.cover_image)} alt={album.title} className="detail-cover" />
        <div>
          <h2>{album.title}</h2>
          <p className="detail-subtitle">
            <Disc3 size={14} />
            <Link to={`/artists/${album.artist}`}>{album.artist_name}</Link>
          </p>

          <div className="meta-chips">
            <span className="meta-chip">
              <Music2 size={13} />
              {albumTracks.length} tracks
            </span>
            <span className="meta-chip">
              <Eye size={13} />
              {album.visibility}
            </span>
            {album.release_date ? (
              <span className="meta-chip">
                <CalendarDays size={13} />
                {formatDate(album.release_date)}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="section-title">
        <Music2 size={16} />
        <h3>Tracks</h3>
      </div>

      <ul className="simple-list">
        {albumTracks.length ? (
          albumTracks.map((track) => (
            <li key={track.id}>
              <Link to={`/tracks/${track.id}`}>{track.title}</Link>
            </li>
          ))
        ) : (
          <li>No tracks linked to this album yet.</li>
        )}
      </ul>
    </section>
  )
}

export default AlbumDetailPage
