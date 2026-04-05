from pathlib import Path
import os
from dotenv import load_dotenv
from datetime import timedelta
from urllib.parse import urlparse, parse_qs

BASE_DIR = Path(__file__).resolve().parent.parent


def load_environment_files():
    env_type = os.getenv('APP_ENV', 'local').lower()

    if env_type == 'prod':
        load_dotenv(BASE_DIR / '.env.prod')
    else:
        load_dotenv(BASE_DIR / '.env.local')


def parse_database_url(database_url):
    parsed = urlparse(database_url)
    query = parse_qs(parsed.query)

    options = {}
    if query.get('sslmode'):
        options['sslmode'] = query['sslmode'][0]

    config = {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': parsed.path.lstrip('/'),
        'USER': parsed.username,
        'PASSWORD': parsed.password,
        'HOST': parsed.hostname,
        'PORT': str(parsed.port or 5432),
    }

    if options:
        config['OPTIONS'] = options

    return config


load_environment_files()

# SECURITY
SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
    "music-nine-theta-13.vercel.app",
    ".vercel.app",
]

CSRF_TRUSTED_ORIGINS = [
    "https://music-nine-theta-13.vercel.app",
]

CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# CORS (STRICT — correct approach)
CORS_ALLOW_ALL_ORIGINS = False

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "https://music-nine-theta-13.vercel.app",
]

CORS_ALLOW_CREDENTIALS = True

# DATABASE
database_url = os.getenv('DATABASE_URL', '').strip()

if database_url:
    DATABASES = {
        'default': parse_database_url(database_url)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.getenv('DB_NAME'),
            'USER': os.getenv('DB_USER'),
            'PASSWORD': os.getenv('DB_PASSWORD'),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '5432'),
        }
    }

# INSTALLED APPS
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',
    'corsheaders',

    'api',
]

# JWT (with blacklist support)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
}

# MIDDLEWARE
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

# AUTH
AUTH_USER_MODEL = 'api.User'

ROOT_URLCONF = 'config.urls'
WSGI_APPLICATION = 'config.wsgi.application'

# CACHE (⚠️ must be external in production)
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.getenv("REDIS_URL", "redis://127.0.0.1:6379/1"),
    }
}

# TEMPLATES
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# INTERNATIONALIZATION
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# STATIC / MEDIA
STATIC_URL = 'static/'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'