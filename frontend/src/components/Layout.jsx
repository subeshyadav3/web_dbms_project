import {
  Disc3,
  Home,
  ListMusic,
  Library,
  LogOut,
  Mic2,
  Music,
  SquareLibrary,
  UserRound,
  Heart,
  Wrench,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PlayerBar from './PlayerBar'
import Topbar from './Topbar'

const navItems = [
  { to: '/', icon: Home, label: 'Discover' },
  { to: '/tracks', icon: ListMusic, label: 'Tracks' },
  { to: '/artists', icon: Mic2, label: 'Artists' },
  { to: '/albums', icon: Disc3, label: 'Albums' },
  { to: '/playlists', icon: SquareLibrary, label: 'Playlists' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/manage', icon: Wrench, label: 'Manage' },
  { to: '/profile', icon: UserRound, label: 'Profile' },
]

function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Music size={24} />
          <div>
            <h1>BeatBox</h1>
            <p>Music Player</p>
          </div>
        </div>

        <nav className="nav-links">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active-nav' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <p className="sidebar-user-name">{user?.username || 'Guest User'}</p>
          <small className="sidebar-user-email">{user?.email || 'No email'}</small>
          <button type="button" onClick={logout} className="ghost-btn logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <div className="content-wrap">
        <Topbar />
        <main className="page-content">
          <Outlet />
        </main>
        <PlayerBar />
      </div>
    </div>
  )
}

export default Layout
