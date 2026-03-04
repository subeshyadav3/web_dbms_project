from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, Artist, Album, Track, Playlist, PlaylistTrack,
    TrackLike, Favorite, FavoritePlaylist, FavoriteArtist,
    PlayHistory, Genre, TrackGenre, TrackStat,
    TrendingTrack, Notification, UserFollow
)

# -------------------- User Serializers --------------------

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'is_artist')

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            is_artist=validated_data.get('is_artist', False)
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'is_artist', 'bio', 'profile_image', 'account_status', 'created_at')
        read_only_fields = ['id', 'created_at']

# -------------------- Artist Serializer --------------------

class ArtistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Artist
        fields = ['id', 'user', 'stage_name', 'verified', 'country', 'description', 'created_at']

# -------------------- Album Serializer --------------------

class AlbumSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.stage_name', read_only=True)

    class Meta:
        model = Album
        fields = ['id', 'artist', 'artist_name', 'title', 'cover_image', 'release_date', 'visibility', 'created_at']

# -------------------- Track Stat Serializer --------------------

class TrackStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackStat
        fields = ['total_plays', 'weekly_plays', 'monthly_plays', 'total_likes', 'last_played_at']

# -------------------- Track Serializer --------------------

class TrackSerializer(serializers.ModelSerializer):
    artist_name = serializers.CharField(source='artist.stage_name', read_only=True)
    album_title = serializers.CharField(source='album.title', read_only=True)
    stats = TrackStatSerializer(source='trackstat', read_only=True)

    class Meta:
        model = Track

        fields = [
            'id', 'title', 'audio_url', 'duration',  
            'artist', 'artist_name', 'album', 'album_title',  'stats',
            'created_at'
        ]
# -------------------- Playlist Serializer --------------------

class PlaylistSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Playlist
        fields = ['id', 'user', 'name', 'description', 'is_public', 'created_at', 'updated_at']

# -------------------- Playlist Track Serializer --------------------

class PlaylistTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)

    class Meta:
        model = PlaylistTrack
        fields = ['id', 'playlist', 'track', 'position', 'added_at']

# -------------------- Genre Serializer --------------------

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

# -------------------- Track Genre Serializer --------------------

class TrackGenreSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(read_only=True)

    class Meta:
        model = TrackGenre
        fields = ['id', 'track', 'genre']

# -------------------- Likes & Favorites --------------------

class TrackLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrackLike
        fields = ['id', 'user', 'track', 'created_at']

# Updated Favorite serializer
class FavoriteTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite  # <-- changed from FavoriteTrack to Favorite
        fields = ['id', 'user', 'track', 'created_at']

class FavoritePlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoritePlaylist
        fields = ['id', 'user', 'playlist', 'created_at']

class FavoriteArtistSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteArtist
        fields = ['id', 'user', 'artist', 'created_at']
# -------------------- Play History --------------------

class PlayHistorySerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)

    class Meta:
        model = PlayHistory
        fields = ['id', 'user', 'track', 'played_at', 'play_duration']

# -------------------- Trending Track --------------------

class TrendingTrackSerializer(serializers.ModelSerializer):
    track = TrackSerializer(read_only=True)

    class Meta:
        model = TrendingTrack
        fields = ['id', 'track', 'trend_score', 'period', 'calculated_at']

# -------------------- Notifications --------------------

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'user', 'type', 'reference_id', 'is_read', 'created_at']

# -------------------- User Follow --------------------

class UserFollowSerializer(serializers.ModelSerializer):
    follower = UserSerializer(read_only=True)
    following = UserSerializer(read_only=True)

    class Meta:
        model = UserFollow
        fields = ['id', 'follower', 'following', 'created_at']