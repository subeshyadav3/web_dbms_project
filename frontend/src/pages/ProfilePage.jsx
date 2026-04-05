import { BadgeCheck, Mail, RefreshCcw, UserRound } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toMediaUrl } from '../utils/media'
import { formatDate } from '../utils/format'

function ProfilePage() {
  const { user, fetchProfile } = useAuth()

  return (
    <section className="page-section">
      <header className="page-header">
        <div>
          <h2>Profile</h2>
          <p>Manage your account, identity, and social metrics.</p>
        </div>
        <button type="button" className="ghost-btn" onClick={fetchProfile}>
          <RefreshCcw size={15} />
          Refresh
        </button>
      </header>

      <div className="profile-card">
        <img
          src={toMediaUrl(user?.profile_image)}
          alt={user?.username}
          className="profile-image"
        />

        <div className="profile-info">
          <h3>{user?.username}</h3>
          <p>{user?.bio || 'No bio available.'}</p>

          <div className="profile-tags">
            <span>
              <Mail size={14} />
              {user?.email}
            </span>
            <span>
              <UserRound size={14} />
              {user?.is_artist ? 'Artist Account' : 'Listener Account'}
            </span>
            <span>
              <BadgeCheck size={14} />
              {user?.account_status || 'active'}
            </span>
            <span>
              Joined {formatDate(user?.created_at)}
            </span>
          </div>

          <div className="followers-wrap">
            <div>
              <strong>{user?.followers_count ?? 0}</strong>
              <small>Followers</small>
            </div>
            <div>
              <strong>{user?.following_count ?? 0}</strong>
              <small>Following</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProfilePage
