from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings

# ------------------------
# ENUMS
# ------------------------

class AccountStatus(models.TextChoices):
    ACTIVE = "active", "Active"
    SUSPENDED = "suspended", "Suspended"

class Visibility(models.TextChoices):
    PUBLIC = "public", "Public"
    PRIVATE = "private", "Private"

class TrendPeriod(models.TextChoices):
    DAILY = "daily", "Daily"
    WEEKLY = "weekly", "Weekly"
    MONTHLY = "monthly", "Monthly"

# ------------------------
# USER MANAGER
# ------------------------

class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, username, password, **extra_fields)

# ------------------------
# USER
# ------------------------

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    bio = models.TextField(blank=True ,default='No bio')
    profile_image = models.ImageField(upload_to='profiles/', default='profiles/default.png')
    is_artist = models.BooleanField(default=False)
    account_status = models.CharField(
        max_length=10,
        choices=AccountStatus.choices,
        default=AccountStatus.ACTIVE
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = UserManager()

    def __str__(self):
        return self.username

# ------------------------
# ARTIST
# ------------------------

class Artist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="artist_profile")
    stage_name = models.CharField(max_length=100)
    verified = models.BooleanField(default=False)
    country = models.CharField(max_length=100, default='Nepal')
    description = models.TextField(default='No description')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.stage_name

# ------------------------
# ALBUM
# ------------------------

class Album(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE, related_name="albums")
    title = models.CharField(max_length=150)
    cover_image = models.ImageField(
    upload_to='covers/',
    null=False,
    blank=True,
    default='covers/default_cover.jpg'  
)
    release_date = models.DateField(null=True, blank=True)
    visibility = models.CharField(max_length=10, choices=Visibility.choices, default=Visibility.PUBLIC)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

# ------------------------
# TRACK
# ------------------------

class Track(models.Model):
    artist = models.ForeignKey(
        Artist,
        on_delete=models.CASCADE,
        related_name="tracks"
    )
    album = models.ForeignKey(
        Album,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="tracks"
    )
    title = models.CharField(max_length=150)
    # Audio file
    audio_url = models.FileField(
        upload_to='tracks/',           # media/tracks/
        default='tracks/default.mp3'
    )

    # Track cover image
    cover_image = models.ImageField(
        upload_to='track_covers/',     # media/track_covers/
        default='track_covers/default.png'
    )
    duration = models.IntegerField(null=True, blank=True)
    
    play_count = models.PositiveIntegerField(default=0)  # <-- add this

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return self.title

# ------------------------
# PLAYLIST
# ------------------------

class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="playlists")
    name = models.CharField(max_length=100)
    description = models.TextField(default='No description')
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class PlaylistTrack(models.Model):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="playlist_tracks")
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    position = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("playlist", "track")

# ------------------------
# LIKES & FAVORITES
# ------------------------

class TrackLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liked_tracks")
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "track")

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_tracks")
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "track")

class FavoritePlaylist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_playlists")
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "playlist")

class FavoriteArtist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorite_artists")
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "artist")

# ------------------------
# PLAY HISTORY
# ------------------------

class PlayHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="play_history")
    track = models.ForeignKey(Track, on_delete=models.CASCADE)
    played_at = models.DateTimeField(auto_now_add=True)
    play_duration = models.IntegerField(null=True, blank=True)  # optional

# ------------------------
# GENRE & TRACK GENRE
# ------------------------

class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class TrackGenre(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='track_genres')
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name='track_genres')

    class Meta:
        unique_together = ('track', 'genre')

# ------------------------
# TRACK STAT
# ------------------------

class TrackStat(models.Model):
    track = models.OneToOneField(Track, on_delete=models.CASCADE, related_name="trackstat")
    total_plays = models.IntegerField(default=0)
    weekly_plays = models.IntegerField(default=0)
    monthly_plays = models.IntegerField(default=0)
    total_likes = models.IntegerField(default=0)
    last_played_at = models.DateTimeField(null=True, blank=True)

# ------------------------
# TRENDING TRACK
# ------------------------

class TrendingTrack(models.Model):
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name="trending_records")
    trend_score = models.DecimalField(max_digits=10, decimal_places=2)
    period = models.CharField(max_length=10, choices=TrendPeriod.choices)
    calculated_at = models.DateTimeField(auto_now_add=True)

# ------------------------
# NOTIFICATIONS
# ------------------------

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=100)
    reference_id = models.IntegerField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

# ------------------------
# USER FOLLOW
# ------------------------

class UserFollow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following_relations")
    following = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers_relations")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following")