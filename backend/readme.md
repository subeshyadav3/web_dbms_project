current folder structure:

api/
├── __init__.py
├── admin.py
├── apps.py
├── models.py            # ALL models (as you already designed)
│
├── auth/                # authentication + authorization
│   ├── __init__.py
│   ├── views.py         # login, signup, logout
│   ├── permissions.py   # role & ownership checks
│   └── tokens.py        # JWT / session helpers
│
├── views/               # API endpoints (grouped by domain)
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
├── services/            # business logic (NO HTTP, NO SQL)
│   ├── __init__.py
│   ├── playlist_service.py
│   ├── track_service.py
│   ├── recommendation_service.py
│   └── notification_service.py
│
├── db/                  # raw PostgreSQL access
│   ├── __init__.py
│   ├── analytics.py     # trending, stats
│   ├── reports.py
│   └── queries.sql      # optional reference
│
├── serializers.py       # request/response shaping (DRF or manual)
├── urls.py              # /api/... routes
└── utils.py
