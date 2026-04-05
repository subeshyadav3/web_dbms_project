import { BadgeCheck, Disc3, MapPin, Mic2, Music2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toMediaUrl } from '../utils/media'

function ArtistCard({ artist }) {
  const profileImage = toMediaUrl(artist?.user?.profile_image)

  return (
    <article className="artist-card interactive-card">
      <Link
        to={`/artists/${artist.id}`}
        className="avatar-link"
        aria-label={`Open ${artist.stage_name}`}
      >
        {profileImage ? (
          <img src={profileImage} alt={artist.stage_name} className="card-avatar" />
        ) : (
          <div className="card-avatar card-cover-placeholder">
            <Mic2 size={24} />
          </div>
        )}
      </Link>

      <div className="card-body">
        <h4>
          <Link to={`/artists/${artist.id}`}>{artist.stage_name}</Link>
        </h4>
        <p>
          <MapPin size={14} />
          {artist.country || 'Unknown Country'}
        </p>

        <div className="meta-chips">
          <span className="meta-chip">
            <Music2 size={13} />
            {artist.tracks_count ?? 0} tracks
          </span>
          <span className="meta-chip">
            <Disc3 size={13} />
            {artist.albums_count ?? 0} albums
          </span>
          <span className="meta-chip">
            <BadgeCheck size={13} />
            {artist.verified ? 'Verified' : 'Artist'}
          </span>
        </div>
      </div>
    </article>
  )
}

export default ArtistCard
