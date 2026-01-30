# Project Structure

```text
api/
├── __init__.py
├── admin.py
├── apps.py
├── models.py            # All models (users, tracks, albums, playlists, etc.)
│
├── auth/                # Authentication & authorization
│   ├── __init__.py
│   ├── views.py         # login, signup, logout endpoints
│   ├── permissions.py   # role-based & ownership checks
│   └── tokens.py        # JWT/session helpers
│
├── views/               # API endpoints grouped by domain
│   ├── __init__.py
│   ├── users.py
│   ├── artists.py
│   ├── tracks.py
│   ├── albums.py
│   ├── playlists.py
│   ├── comments.py
│   ├── favorites.py
│   ├── analytics.py
│   └── notifications.py
│
├── services/            # Business logic (no HTTP or SQL)
│   ├── __init__.py
│   ├── playlist_service.py
│   ├── track_service.py
│   ├── recommendation_service.py
│   └── notification_service.py
│
├── db/                  # PostgreSQL/raw SQL helpers
│   ├── __init__.py
│   ├── analytics.py     # trending tracks, stats
│   ├── reports.py
│   └── queries.sql      # optional reference queries
│
├── serializers.py       # request/response shaping (DRF or manual)
├── urls.py              # /api/... routes
└── utils.py             # misc helpers (formatting, validation, etc.)
