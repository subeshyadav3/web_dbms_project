import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import ProfilePage from './pages/ProfilePage'
import AlbumsPage from './pages/AlbumsPage'
import ArtistsPage from './pages/ArtistsPage'
import PlaylistsPage from './pages/PlaylistsPage'
import SearchPage from './pages/SearchPage'
import NotificationsPage from './pages/NotificationsPage'
import FavoritesPage from './pages/FavoritesPage'
import ManagePage from './pages/ManagePage'
import TracksPage from './pages/TracksPage'
import TrackDetailPage from './pages/TrackDetailPage'
import ArtistDetailPage from './pages/ArtistDetailPage'
import AlbumDetailPage from './pages/AlbumDetailPage'
import { useAuth } from './contexts/AuthContext'

function App() {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="app-loader">
        <p>Loading your music space...</p>
      </div>
    )
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="tracks" element={<TracksPage />} />
        <Route path="artists" element={<ArtistsPage />} />
        <Route path="artists/:id" element={<ArtistDetailPage />} />
        <Route path="albums" element={<AlbumsPage />} />
        <Route path="albums/:id" element={<AlbumDetailPage />} />
        <Route path="tracks/:id" element={<TrackDetailPage />} />
        <Route path="playlists" element={<PlaylistsPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="library" element={<LibraryPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="manage" element={<ManagePage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  )
}

export default App
