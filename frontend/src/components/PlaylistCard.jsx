import { Clock3, Globe2, Lock, UserRound } from 'lucide-react'
import { formatDate } from '../utils/format'

function PlaylistCard({ playlist }) {
  return (
    <article className="playlist-card interactive-card">
      <div className="card-body">
        <h4>{playlist.name}</h4>
        <p>{playlist.description || 'No description provided.'}</p>

        <div className="meta-chips">
          <span className="meta-chip">
            {playlist.is_public ? <Globe2 size={13} /> : <Lock size={13} />}
            {playlist.is_public ? 'Public' : 'Private'}
          </span>

          {playlist.user?.username ? (
            <span className="meta-chip">
              <UserRound size={13} />
              {playlist.user.username}
            </span>
          ) : null}

          {playlist.updated_at ? (
            <span className="meta-chip">
              <Clock3 size={13} />
              Updated {formatDate(playlist.updated_at)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default PlaylistCard
