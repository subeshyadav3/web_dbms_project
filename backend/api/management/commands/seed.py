from curses import meta
import email
from os import name

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from random import randint, choice, sample
from api.models import Artist, Album, Track, Genre, TrackGenre, TrackStat, Playlist, PlaylistTrack, Favorite, FavoriteArtist, FavoritePlaylist, PlayHistory, TrackLike, TrendingTrack, Notification, UserFollow
import datetime
import random 
from decimal import Decimal

User = get_user_model()

# -------------------------------
# Genre list
# -------------------------------
GENRES = [
    "Pop", "Rock", "Hip-Hop", "Folk",
    "Romantic", "Indie", "Electronic", "Classical"
]

# -------------------------------
# Artists metadata
# -------------------------------
ARTISTS = {
    # Nepali
    "Sushant KC": {"country": "Nepal", "description": "Nepali pop singer"},
    "Sajjan Raj Vaidya": {"country": "Nepal", "description": "Indie pop artist"},
    "Bipul Chettri": {"country": "India", "description": "Folk musician"},
    "Tribal Rain": {"country": "Nepal", "description": "Nepali indie band"},
    "Neetesh Jung Kunwar": {"country": "Nepal", "description": "Singer-songwriter"},
    # English
    "Ed Sheeran": {"country": "UK", "description": "Global pop artist"},
    "Taylor Swift": {"country": "US", "description": "Pop and country artist"},
    "Coldplay": {"country": "UK", "description": "Rock band"},
    "Billie Eilish": {"country": "US", "description": "Alternative pop artist"},
    "Imagine Dragons": {"country": "US", "description": "Pop-rock band"},
    # Hindi
    "Arijit Singh": {"country": "India", "description": "Bollywood playback singer"},
    "Atif Aslam": {"country": "Pakistan", "description": "Romantic pop singer"},
    "Shreya Ghoshal": {"country": "India", "description": "Playback singer"},
    "Jubin Nautiyal": {"country": "India", "description": "Pop and romantic singer"},
    "Neha Kakkar": {"country": "India", "description": "Party and pop singer"},
}

# -------------------------------
# Tracks data: (artist, album, title, duration, language, file)
# -------------------------------
TRACKS = [
    # Nepali 20
    ("Sushant KC", "Singles", "Bardali", 215, "Nepali", "nepali_01.mp3"),
    ("Sushant KC", "Singles", "Aama", 230, "Nepali", "nepali_02.mp3"),
    ("Sushant KC", "Singles", "Gulabi", 210, "Nepali", "nepali_03.mp3"),
    ("Sushant KC", "Singles", "Muskan", 225, "Nepali", "nepali_04.mp3"),
    ("Sajjan Raj Vaidya", "Singles", "Hataarindai Bataasindai", 245, "Nepali", "nepali_05.mp3"),
    ("Sajjan Raj Vaidya", "Singles", "Chitthi Bhitra", 260, "Nepali", "nepali_06.mp3"),
    ("Sajjan Raj Vaidya", "Singles", "Naganya Maya", 235, "Nepali", "nepali_07.mp3"),
    ("Sajjan Raj Vaidya", "Singles", "Lukaamaari", 250, "Nepali", "nepali_08.mp3"),
    ("Bipul Chettri", "Sketches of Darjeeling", "Asaar", 240, "Nepali", "nepali_09.mp3"),
    ("Bipul Chettri", "Sketches of Darjeeling", "Syndicate", 265, "Nepali", "nepali_10.mp3"),
    ("Bipul Chettri", "Sketches of Darjeeling", "Jholay", 255, "Nepali", "nepali_11.mp3"),
    ("Bipul Chettri", "Sketches of Darjeeling", "Ram Sailee", 270, "Nepali", "nepali_12.mp3"),
    ("Tribal Rain", "Roka Yo Samay", "Roka Yo Samay", 245, "Nepali", "nepali_13.mp3"),
    ("Tribal Rain", "Roka Yo Samay", "Bhanai", 230, "Nepali", "nepali_14.mp3"),
    ("Tribal Rain", "Roka Yo Samay", "Sunideu", 240, "Nepali", "nepali_15.mp3"),
    ("Tribal Rain", "Roka Yo Samay", "Narisauna", 250, "Nepali", "nepali_16.mp3"),
    ("Neetesh Jung Kunwar", "Singles", "Gedai Jasto Jindagi", 275, "Nepali", "nepali_17.mp3"),
    ("Neetesh Jung Kunwar", "Singles", "Flirty Maya", 240, "Nepali", "nepali_18.mp3"),
    ("Neetesh Jung Kunwar", "Singles", "Kholai Khola", 260, "Nepali", "nepali_19.mp3"),
    ("Neetesh Jung Kunwar", "Singles", "Sathi", 255, "Nepali", "nepali_20.mp3"),

    # English 20
    ("Ed Sheeran", "Divide", "Shape of You", 233, "English", "english_01.mp3"),
    ("Ed Sheeran", "Divide", "Perfect", 263, "English", "english_02.mp3"),
    ("Ed Sheeran", "Divide", "Castle on the Hill", 261, "English", "english_03.mp3"),
    ("Ed Sheeran", "Divide", "Galway Girl", 170, "English", "english_04.mp3"),
    ("Taylor Swift", "1989", "Blank Space", 231, "English", "english_05.mp3"),
    ("Taylor Swift", "1989", "Style", 231, "English", "english_06.mp3"),
    ("Taylor Swift", "1989", "Shake It Off", 242, "English", "english_07.mp3"),
    ("Taylor Swift", "1989", "Wildest Dreams", 220, "English", "english_08.mp3"),
    ("Coldplay", "A Head Full of Dreams", "Hymn for the Weekend", 258, "English", "english_09.mp3"),
    ("Coldplay", "A Head Full of Dreams", "Adventure of a Lifetime", 263, "English", "english_10.mp3"),
    ("Coldplay", "A Head Full of Dreams", "Everglow", 280, "English", "english_11.mp3"),
    ("Coldplay", "A Head Full of Dreams", "Up&Up", 405, "English", "english_12.mp3"),
    ("Billie Eilish", "When We All Fall Asleep", "Bad Guy", 194, "English", "english_13.mp3"),
    ("Billie Eilish", "When We All Fall Asleep", "Bury a Friend", 193, "English", "english_14.mp3"),
    ("Billie Eilish", "When We All Fall Asleep", "Ilomilo", 156, "English", "english_15.mp3"),
    ("Billie Eilish", "When We All Fall Asleep", "All the Good Girls Go to Hell", 168, "English", "english_16.mp3"),
    ("Imagine Dragons", "Evolve", "Believer", 204, "English", "english_17.mp3"),
    ("Imagine Dragons", "Evolve", "Thunder", 187, "English", "english_18.mp3"),
    ("Imagine Dragons", "Evolve", "Whatever It Takes", 201, "English", "english_19.mp3"),
    ("Imagine Dragons", "Evolve", "Walking the Wire", 202, "English", "english_20.mp3"),

    # Hindi 20
    ("Arijit Singh", "Bollywood Hits", "Tum Hi Ho", 262, "Hindi", "hindi_01.mp3"),
    ("Arijit Singh", "Bollywood Hits", "Channa Mereya", 290, "Hindi", "hindi_02.mp3"),
    ("Arijit Singh", "Bollywood Hits", "Raabta", 244, "Hindi", "hindi_03.mp3"),
    ("Arijit Singh", "Bollywood Hits", "Agar Tum Saath Ho", 331, "Hindi", "hindi_04.mp3"),
    ("Atif Aslam", "Romantic Hits", "Tera Hone Laga Hoon", 300, "Hindi", "hindi_05.mp3"),
    ("Atif Aslam", "Romantic Hits", "Jeene Laga Hoon", 260, "Hindi", "hindi_06.mp3"),
    ("Atif Aslam", "Romantic Hits", "Pehli Nazar Mein", 287, "Hindi", "hindi_07.mp3"),
    ("Atif Aslam", "Romantic Hits", "Dil Diyan Gallan", 255, "Hindi", "hindi_08.mp3"),
    ("Shreya Ghoshal", "Melodies", "Sun Raha Hai", 300, "Hindi", "hindi_09.mp3"),
    ("Shreya Ghoshal", "Melodies", "Teri Ore", 305, "Hindi", "hindi_10.mp3"),
    ("Shreya Ghoshal", "Melodies", "Agar Tum Mil Jao", 338, "Hindi", "hindi_11.mp3"),
    ("Shreya Ghoshal", "Melodies", "Saibo", 212, "Hindi", "hindi_12.mp3"),
    ("Jubin Nautiyal", "Hits", "Lut Gaye", 300, "Hindi", "hindi_13.mp3"),
    ("Jubin Nautiyal", "Hits", "Tum Hi Aana", 310, "Hindi", "hindi_14.mp3"),
    ("Jubin Nautiyal", "Hits", "Bewafa Tera Masoom Chehra", 325, "Hindi", "hindi_15.mp3"),
    ("Jubin Nautiyal", "Hits", "Humnava Mere", 312, "Hindi", "hindi_16.mp3"),
    ("Neha Kakkar", "Party Mix", "Dilbar", 240, "Hindi", "hindi_17.mp3"),
    ("Neha Kakkar", "Party Mix", "Aankh Marey", 210, "Hindi", "hindi_18.mp3"),
    ("Neha Kakkar", "Party Mix", "Kala Chashma", 195, "Hindi", "hindi_19.mp3"),
    ("Neha Kakkar", "Party Mix", "O Saki Saki", 230, "Hindi", "hindi_20.mp3"),
]

# -------------------------------
# Command
# -------------------------------
class Command(BaseCommand):
    help = "Seed the database with Artists, Albums, Tracks, Genres, TrackStats, and auxiliary data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")

        # Clear tables (keep music seed intact)
        Notification.objects.all().delete()
        TrendingTrack.objects.all().delete()
        TrackStat.objects.all().delete()
        TrackGenre.objects.all().delete()
        PlayHistory.objects.all().delete()
        TrackLike.objects.all().delete()
        Favorite.objects.all().delete()
        FavoriteArtist.objects.all().delete()
        FavoritePlaylist.objects.all().delete()
        PlaylistTrack.objects.all().delete()
        Playlist.objects.all().delete()
        Track.objects.all().delete()
        Album.objects.all().delete()
        Artist.objects.all().delete()
        Genre.objects.all().delete()
        # Delete non-staff users only
        User.objects.filter(is_staff=False).delete()

        self.stdout.write("Creating genres...")
        genre_objs = {}
        for g in GENRES:
            genre_objs[g], _ = Genre.objects.get_or_create(name=g)

        # -------------------------------
        # Helper: Create artist and user
        # -------------------------------
        def create_artist(artist_name, artist_meta):
            user_email = f"{artist_name.lower().replace(' ', '')}@music.com"
            user, created = User.objects.get_or_create(
                email=user_email,
                defaults={"username": artist_name.replace(" ", "_"), "is_artist": True}
            )
            if created:
                user.set_password("artist123") 
                user.save()

            artist, _ = Artist.objects.get_or_create(
                user=user,
                stage_name=artist_name,
                defaults={"country": artist_meta["country"], "description": artist_meta["description"], "verified": True}
            )
            return artist

        # -------------------------------
        # Seed tracks
        # -------------------------------
        def seed_tracks():
            for artist_name, album_title, track_title, duration, language, file_name in TRACKS:
                artist = create_artist(artist_name, ARTISTS[artist_name])

                album, _ = Album.objects.get_or_create(
                    artist=artist,
                    title=album_title
                )

                track, _ = Track.objects.get_or_create(
                    artist=artist,
                    album=album,
                    title=track_title,
                    defaults={
                        "audio_url": f"tracks/{file_name}",
                        "duration": duration,
                    }
                )

                # Assign random genre
                genre_name = choice(GENRES)
                TrackGenre.objects.get_or_create(track=track, genre=genre_objs[genre_name])

                # Create track stats
                TrackStat.objects.get_or_create(
                    track=track,
                    defaults={
                        "total_plays": randint(1000, 100000),
                        "weekly_plays": randint(100, 5000),
                        "monthly_plays": randint(500, 20000),
                        "total_likes": randint(50, 5000),
                        "last_played_at": timezone.now()
                    }
                )

        self.stdout.write("Seeding tracks...")
        seed_tracks()
        self.stdout.write(self.style.SUCCESS("✅ Music tracks seeded successfully"))

        # -------------------------------
        # Seed auxiliary data
        # -------------------------------
        self.stdout.write("Seeding auxiliary data...")

        # 1. Create additional users
        extra_usernames = [f"user{i}" for i in range(1, 21)]
        extra_users = []
        for uname in extra_usernames:
            u, created = User.objects.get_or_create(
                username=uname,
                defaults={"email": f"{uname}@example.com"}
            )
            if created:
                u.set_password("user123")
                u.save()
            extra_users.append(u)

        # 2. Create playlists for users
        all_tracks = list(Track.objects.all())
        playlist_objs = []
        for u in extra_users:
            for _ in range(randint(1, 3)):
                p = Playlist.objects.create(
                    user=u,
                    name=f"{u.username}_playlist_{randint(1,100)}"
                )
                selected_tracks = sample(all_tracks, randint(3, 8))
                for t in selected_tracks:
                    PlaylistTrack.objects.create(playlist=p, track=t)
                playlist_objs.append(p)

        # 3. Create favorites (tracks, playlists, artists)
        artists = list(Artist.objects.all())
        for u in extra_users:
            for t in sample(all_tracks, randint(2, 5)):
                Favorite.objects.get_or_create(user=u, track=t)
            for p in sample(playlist_objs, randint(1, 3)):
                FavoritePlaylist.objects.get_or_create(user=u, playlist=p)
            for a in sample(artists, randint(1, 3)):
                FavoriteArtist.objects.get_or_create(user=u, artist=a)

        # 4. Play history
        for _ in range(200):
            PlayHistory.objects.create(
                user=choice(extra_users),
                track=choice(all_tracks),
                played_at=timezone.now() - datetime.timedelta(days=randint(0, 90))
            )

        # 5. Likes & update stats
        for t in all_tracks:
            liked_users = sample(extra_users, randint(2, 6))
            for u in liked_users:
                TrackLike.objects.get_or_create(user=u, track=t)
            stat = TrackStat.objects.get(track=t)
            stat.total_likes = TrackLike.objects.filter(track=t).count()
            stat.total_plays = PlayHistory.objects.filter(track=t).count()
            stat.save()

        # 6. Notifications
        # Your model uses 'type', not 'message'
        notif_types = ["New track", "Like", "Follow", "System"]
        for u in extra_users:
            for _ in range(randint(5, 10)):
                Notification.objects.create(
                    user=u,
                    type=choice(notif_types),
                    created_at=timezone.now() - datetime.timedelta(days=randint(0, 30))
                )

        # 7. Trending tracks
        periods = ["weekly", "monthly"]
        for t in all_tracks:
            for period in periods:
                TrendingTrack.objects.get_or_create(
                    track=t,
                    period=period,
                    defaults={"trend_score": Decimal(randint(50, 1000))}
                )

        self.stdout.write(self.style.SUCCESS("✅ Auxiliary data seeded successfully!"))