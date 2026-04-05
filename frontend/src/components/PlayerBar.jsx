import { useEffect, useRef } from 'react'
import { SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react'
import { FaPauseCircle, FaPlayCircle } from 'react-icons/fa'
import { usePlayer } from '../contexts/PlayerContext'
import { formatDuration } from '../utils/format'
import { playTrackRequest } from '../api/track.api'
import { toMediaUrl } from '../utils/media'
import '../App.css'

function PlayerBar() {
  const audioRef = useRef(null)
  const playedTrackRef = useRef(null)

  const {
    currentTrack, isPlaying, togglePlay, playNext, playPrevious,
    volume, setVolume, currentTime, setCurrentTime, duration, setDuration,
  } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    const player = audioRef.current
    if (!player || !currentTrack) return
    player.src = 'http://127.0.0.1:8000/media/tracks/default.mp3'
    player.play().then(async () => {
      if (playedTrackRef.current !== currentTrack.id) {
        playedTrackRef.current = currentTrack.id
        try { await playTrackRequest(currentTrack.id) } catch {}
      }
    }).catch(() => {})
  }, [currentTrack])

  useEffect(() => {
    const player = audioRef.current
    if (!player || !currentTrack) return
    if (isPlaying) player.play().catch(() => {})
    else player.pause()
  }, [isPlaying, currentTrack])

  const handleSeek = (e) => {
    const t = Number(e.target.value)
    if (audioRef.current) audioRef.current.currentTime = t
    setCurrentTime(t)
  }

  const progress = duration ? (currentTime / duration) * 100 : 0
  const volPercent = volume * 100

  return (
    <div className={`pbar ${!currentTrack ? 'pbar--empty' : ''}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onEnded={playNext}
      />

      {!currentTrack ? (
        <div className="pbar__idle">
          <Music size={14} />
          <span>Select a track to start listening</span>
        </div>
      ) : (
        <div className="pbar__inner">

          {/* Track info */}
          <div className="pbar__track">
            <div className="pbar__cover">
              {toMediaUrl(currentTrack.cover_image)
                ? <img src={toMediaUrl(currentTrack.cover_image)} alt={currentTrack.title} />
                : <Music size={16} />
              }
            </div>
            <div className="pbar__meta">
              <strong>{currentTrack.title}</strong>
              <span>{currentTrack.artist_name || 'Unknown Artist'}</span>
            </div>
          </div>

          {/* Controls + scrubber */}
          <div className="pbar__center">
            <div className="pbar__controls">
              <button type="button" className="pbar__btn" onClick={playPrevious}>
                <SkipBack size={15} />
              </button>
              <button type="button" className="pbar__play" onClick={togglePlay}>
                {isPlaying ? <FaPauseCircle size={34} /> : <FaPlayCircle size={34} />}
              </button>
              <button type="button" className="pbar__btn" onClick={playNext}>
                <SkipForward size={15} />
              </button>
            </div>

            <div className="pbar__scrubber">
              <span className="pbar__time">{formatDuration(currentTime)}</span>
              <div className="pbar__track-wrap">
                <div className="pbar__track-fill" style={{ width: `${progress}%` }} />
                <input
                  type="range" min="0" max={duration || 0}
                  value={Math.min(currentTime, duration || 0)}
                  onChange={handleSeek}
                  className="pbar__range"
                />
              </div>
              <span className="pbar__time">{formatDuration(duration)}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="pbar__volume">
            {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            <div className="pbar__track-wrap pbar__track-wrap--vol">
              <div className="pbar__track-fill" style={{ width: `${volPercent}%` }} />
              <input
                type="range" min="0" max="1" step="0.01" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="pbar__range"
              />
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

export default PlayerBar