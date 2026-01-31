from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from random import randint, choice
from api.models import Artist, Album, Track, Genre, TrackGenre, TrackStat

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
    help = "Seed the database with Artists, Albums, Tracks, Genres, and TrackStats"

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old data...")
        TrackStat.objects.all().delete()
        TrackGenre.objects.all().delete()
        Track.objects.all().delete()
        Album.objects.all().delete()
        Artist.objects.all().delete()
        Genre.objects.all().delete()
        User.objects.filter(is_staff=False).delete()

        self.stdout.write("Creating genres...")
        genre_objs = {}
        for g in GENRES:
            genre_objs[g], _ = Genre.objects.get_or_create(name=g)

        def create_artist(name, meta):
            email = f"{name.lower().replace(' ', '')}@music.com"
            user, _ = User.objects.get_or_create(
                email=email,
                defaults={"username": name.replace(" ", "_"), "is_artist": True, "password": "artist123"}
            )
            artist, _ = Artist.objects.get_or_create(
                user=user,
                stage_name=name,
                defaults={"country": meta["country"], "description": meta["description"], "verified": True}
            )
            return artist

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
                    uploaded_by=artist.user,
                    title=track_title,
                    defaults={
                        "audio_url": f"/media/tracks/{file_name}",
                        "duration": duration,
                        "language": language,
                        "is_original": True
                    }
                )

                # Assign genre based on title (simplified mapping)
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

        self.stdout.write("Seeding tracks and related data...")
        seed_tracks()
        self.stdout.write(self.style.SUCCESS("✅ Database seeded successfully with 60 tracks!"))
