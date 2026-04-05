import { BellRing, TrendingUp, Disc3 } from 'lucide-react'
import { useMemo } from 'react'
import { useHomeData } from '../state/useHomeData'
import '../App.css'

function NotificationsPage() {
  const { trendingTracks, albums } = useHomeData()

  const notifications = useMemo(() => {
    const trendItems = trendingTracks.slice(0, 3).map((track) => ({
      id: `trend-${track.id}`,
      type: 'trend',
      title: track.title,
      sub: track.artist_name || 'Unknown Artist',
      text: 'is trending this week',
    }))

    const albumItems = albums.slice(0, 3).map((album) => ({
      id: `album-${album.id}`,
      type: 'album',
      title: album.title,
      sub: album.artist_name || 'Unknown Artist',
      text: 'album update',
    }))

    return [...trendItems, ...albumItems]
  }, [albums, trendingTracks])

  const iconMap = {
    trend: <TrendingUp size={14} />,
    album: <Disc3 size={14} />,
  }

  return (
    <section className="notif-page">
      <header className="notif-header">
        <div className="notif-header__left">
          <h2>Notifications</h2>
          {notifications.length > 0 && (
            <span className="notif-badge">{notifications.length}</span>
          )}
        </div>
      </header>

      <div className="notif-list">
        {notifications.length ? (
          notifications.map((item) => (
            <article className="notif-card" key={item.id}>
              <div className={`notif-card__icon notif-card__icon--${item.type}`}>
                {iconMap[item.type]}
              </div>
              <div className="notif-card__body">
                <p className="notif-card__text">
                  <span className="notif-card__title">{item.title}</span>
                  {' '}<span className="notif-card__verb">{item.text}</span>
                </p>
                <span className="notif-card__sub">{item.sub}</span>
              </div>
              <div className="notif-card__dot" />
            </article>
          ))
        ) : (
          <div className="fav-empty">
            <div className="fav-empty__icon"><BellRing size={22} /></div>
            <p>No notifications yet.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default NotificationsPage