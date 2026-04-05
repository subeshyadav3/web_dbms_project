import { BadgeCheck, Mail, RefreshCcw, UserRound } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toMediaUrl } from '../utils/media'
import { formatDate } from '../utils/format'
import '../App.css'

function ProfilePage() {
  const { user, fetchProfile } = useAuth()

  return (
    <section className="profile-page">
      <header className="profile-page__header">
        <h2>Profile</h2>
        <button type="button" className="profile-page__refresh" onClick={fetchProfile}>
          <RefreshCcw size={13} />
          Refresh
        </button>
      </header>

      <div className="pcard">
        {/* Left: avatar + stats */}
        <div className="pcard__left">
          <div className="pcard__avatar-wrap">
            {user?.profile_image
              ? <img src={toMediaUrl(user.profile_image)} alt={user.username} className="pcard__avatar" />
              : <div className="pcard__avatar-fallback"><UserRound size={36} /></div>
            }
          </div>

          <div className="pcard__stats">
            <div className="pcard__stat">
              <strong>{user?.followers_count ?? 0}</strong>
              <small>Followers</small>
            </div>
            <div className="pcard__stat-divider" />
            <div className="pcard__stat">
              <strong>{user?.following_count ?? 0}</strong>
              <small>Following</small>
            </div>
          </div>
        </div>

        {/* Right: info */}
        <div className="pcard__right">
          <div className="pcard__top">
            <h3 className="pcard__username">{user?.username}</h3>
            <span className={`pcard__status-badge ${user?.account_status === 'active' ? 'pcard__status-badge--active' : ''}`}>
              <BadgeCheck size={11} />
              {user?.account_status || 'active'}
            </span>
          </div>

          <p className="pcard__bio">{user?.bio || 'No bio available.'}</p>

          <div className="pcard__meta">
            <span className="pcard__meta-item">
              <Mail size={12} />
              {user?.email}
            </span>
            <span className="pcard__meta-item">
              <UserRound size={12} />
              {user?.is_artist ? 'Artist Account' : 'Listener Account'}
            </span>
            <span className="pcard__meta-item pcard__meta-item--muted">
              Joined {formatDate(user?.created_at)}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage