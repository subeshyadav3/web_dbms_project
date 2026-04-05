import { CalendarDays, Disc3, Eye, ListMusic, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '../utils/format'
import { toMediaUrl } from '../utils/media'
import { Album } from 'lucide-react'

function AlbumCard({ album }) {
  const imageUrl = toMediaUrl(album.cover_image)

  return (
    <article className="album-card interactive-card">
      <Link to={`/albums/${album.id}`} className="card-cover-link" aria-label={`Open ${album.title}`}>
        {!imageUrl ? <img src={imageUrl} alt={album.title} className="card-cover" /> : <div className="card-cover card-cover-placeholder"><Album size={28} /></div>}
      </Link>

      <div className="card-body">
        <h4>
          <Link to={`/albums/${album.id}`}>{album.title}</Link>
        </h4>
        <p>
          <UserRound size={14} />
          {album.artist_name || 'Unknown Artist'}
        </p>

        <div className="meta-chips">
          <span className="meta-chip">
            <Eye size={13} />
            {album.visibility || 'public'}
          </span>
          <span className="meta-chip">
            <ListMusic size={13} />
            {album.tracks_count ?? 0} tracks
          </span>
          {album.release_date ? (
            <span className="meta-chip">
              <CalendarDays size={13} />
              {formatDate(album.release_date)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default AlbumCard
