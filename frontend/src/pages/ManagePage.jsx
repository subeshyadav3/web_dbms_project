import { useState } from 'react'
import { createPlaylist } from '../api/playlist.api'
import { createAlbum } from '../api/album.api'
import { createTrack } from '../api/track.api'
import '../App.css'

function ManagePage() {
  const [playlistState, setPlaylistState] = useState({ name: '', description: '', is_public: true })
  const [albumState, setAlbumState] = useState({ title: '', artist: '', release_date: '', visibility: 'public', cover_image: null })
  const [trackState, setTrackState] = useState({ title: '', artist: '', album: '', duration: '', audio_url: null, cover_image: null })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const resetMessages = () => { setStatus(''); setError('') }

  const submitPlaylist = async (e) => {
    e.preventDefault(); resetMessages()
    try { await createPlaylist(playlistState); setStatus('Playlist created successfully') }
    catch (err) { setError(err?.response?.data?.detail || 'Failed to create playlist') }
  }

  const submitAlbum = async (e) => {
    e.preventDefault(); resetMessages()
    const fd = new FormData()
    fd.append('title', albumState.title)
    fd.append('artist', albumState.artist)
    if (albumState.release_date) fd.append('release_date', albumState.release_date)
    fd.append('visibility', albumState.visibility)
    if (albumState.cover_image) fd.append('cover_image', albumState.cover_image)
    try { await createAlbum(fd); setStatus('Album created successfully') }
    catch (err) { setError(err?.response?.data?.detail || 'Failed to create album') }
  }

  const submitTrack = async (e) => {
    e.preventDefault(); resetMessages()
    const fd = new FormData()
    fd.append('title', trackState.title)
    fd.append('artist', trackState.artist)
    if (trackState.album) fd.append('album', trackState.album)
    if (trackState.duration) fd.append('duration', trackState.duration)
    if (trackState.audio_url) fd.append('audio_url', trackState.audio_url)
    if (trackState.cover_image) fd.append('cover_image', trackState.cover_image)
    try { await createTrack(fd); setStatus('Track created successfully') }
    catch (err) { setError(err?.response?.data?.detail || 'Failed to create track') }
  }

  return (
    <section className="manage-page">
      <header className="manage-header">
        <h2>Manage Content</h2>
      </header>

      {status && (
        <div className="manage-toast manage-toast--success">
          <span className="manage-toast__dot" />
          {status}
        </div>
      )}
      {error && (
        <div className="manage-toast manage-toast--error">
          <span className="manage-toast__dot" />
          {error}
        </div>
      )}

      <div className="manage-grid">

        {/* Playlist */}
        <form className="mform" onSubmit={submitPlaylist}>
          <div className="mform__label-tag">01</div>
          <h3 className="mform__title">Playlist</h3>
          <div className="mform__fields">
            <div className="mfield">
              <label className="mfield__label">Name</label>
              <input className="mfield__input" value={playlistState.name}
                onChange={(e) => setPlaylistState(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className="mfield">
              <label className="mfield__label">Description</label>
              <input className="mfield__input" value={playlistState.description}
                onChange={(e) => setPlaylistState(p => ({ ...p, description: e.target.value }))} />
            </div>
            <label className="mfield__toggle">
              <input type="checkbox" checked={playlistState.is_public}
                onChange={(e) => setPlaylistState(p => ({ ...p, is_public: e.target.checked }))} />
              <span className="mfield__toggle-track"><span className="mfield__toggle-thumb" /></span>
              <span className="mfield__toggle-label">Public</span>
            </label>
          </div>
          <button type="submit" className="mform__btn">Create Playlist</button>
        </form>

        {/* Album */}
        <form className="mform" onSubmit={submitAlbum}>
          <div className="mform__label-tag">02</div>
          <h3 className="mform__title">Album</h3>
          <div className="mform__fields">
            <div className="mfield">
              <label className="mfield__label">Title</label>
              <input className="mfield__input" value={albumState.title}
                onChange={(e) => setAlbumState(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="mfield">
              <label className="mfield__label">Artist ID</label>
              <input className="mfield__input" value={albumState.artist}
                onChange={(e) => setAlbumState(p => ({ ...p, artist: e.target.value }))} required />
            </div>
            <div className="mfield">
              <label className="mfield__label">Release Date</label>
              <input className="mfield__input" type="date" value={albumState.release_date}
                onChange={(e) => setAlbumState(p => ({ ...p, release_date: e.target.value }))} />
            </div>
            <div className="mfield">
              <label className="mfield__label">Visibility</label>
              <select className="mfield__input mfield__select" value={albumState.visibility}
                onChange={(e) => setAlbumState(p => ({ ...p, visibility: e.target.value }))}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div className="mfield">
              <label className="mfield__label">Cover Image</label>
              <label className="mfield__file">
                <input type="file" accept="image/*"
                  onChange={(e) => setAlbumState(p => ({ ...p, cover_image: e.target.files?.[0] || null }))} />
                <span>{albumState.cover_image ? albumState.cover_image.name : 'Choose file…'}</span>
              </label>
            </div>
          </div>
          <button type="submit" className="mform__btn">Create Album</button>
        </form>

        {/* Track */}
        <form className="mform" onSubmit={submitTrack}>
          <div className="mform__label-tag">03</div>
          <h3 className="mform__title">Track</h3>
          <div className="mform__fields">
            <div className="mfield">
              <label className="mfield__label">Title</label>
              <input className="mfield__input" value={trackState.title}
                onChange={(e) => setTrackState(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div className="mfield">
              <label className="mfield__label">Artist ID</label>
              <input className="mfield__input" value={trackState.artist}
                onChange={(e) => setTrackState(p => ({ ...p, artist: e.target.value }))} required />
            </div>
            <div className="mfield">
              <label className="mfield__label">Album ID <span className="mfield__optional">optional</span></label>
              <input className="mfield__input" value={trackState.album}
                onChange={(e) => setTrackState(p => ({ ...p, album: e.target.value }))} />
            </div>
            <div className="mfield">
              <label className="mfield__label">Duration (seconds)</label>
              <input className="mfield__input" type="number" value={trackState.duration}
                onChange={(e) => setTrackState(p => ({ ...p, duration: e.target.value }))} />
            </div>
            <div className="mfield">
              <label className="mfield__label">Audio File</label>
              <label className="mfield__file">
                <input type="file" accept="audio/*"
                  onChange={(e) => setTrackState(p => ({ ...p, audio_url: e.target.files?.[0] || null }))} />
                <span>{trackState.audio_url ? trackState.audio_url.name : 'Choose file…'}</span>
              </label>
            </div>
            <div className="mfield">
              <label className="mfield__label">Cover Image</label>
              <label className="mfield__file">
                <input type="file" accept="image/*"
                  onChange={(e) => setTrackState(p => ({ ...p, cover_image: e.target.files?.[0] || null }))} />
                <span>{trackState.cover_image ? trackState.cover_image.name : 'Choose file…'}</span>
              </label>
            </div>
          </div>
          <button type="submit" className="mform__btn">Create Track</button>
        </form>

      </div>
    </section>
  )
}

export default ManagePage