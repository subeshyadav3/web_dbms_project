from django.shortcuts import render
from django.db import connection

def run_query(query):
    with connection.cursor() as cursor:
        cursor.execute(query)
        columns = [col[0] for col in cursor.description]
        rows = cursor.fetchall()
    return columns, rows

def dashboard(request):
    queries = []

    # 1. Joins Artist, Track, and Stats to see who has the most reach
    q1 = """
        SELECT a.stage_name, 
               SUM(ts.total_plays) as total_plays, 
               SUM(ts.total_likes) as total_likes
        FROM api_artist a
        JOIN api_track t ON t.artist_id = a.id
        JOIN api_trackstat ts ON ts.track_id = t.id
        GROUP BY a.stage_name
        ORDER BY total_plays DESC;
    """
    queries.append(("Artist Impact (Plays vs Likes)", run_query(q1)))

    # 2. Uses a CTE to calculate the percentage share of each genre across the platform
    q2 = """
        WITH total_genres AS (SELECT count(*) as total FROM api_trackgenre)
        SELECT g.name, 
               COUNT(tg.id) as count,
               ROUND((COUNT(tg.id)::numeric / (SELECT total FROM total_genres)) * 100, 2) || '%' as percentage
        FROM api_genre g
        JOIN api_trackgenre tg ON tg.genre_id = g.id
        GROUP BY g.name
        ORDER BY count DESC;
    """
    queries.append(("Genre Popularity %", run_query(q2)))

    # 3. Measures user activity by combining their total likes and playlists created
    q3 = """
        SELECT u.username, 
               (COUNT(DISTINCT l.id) + COUNT(DISTINCT p.id)) as engagement_score
        FROM api_user u
        LEFT JOIN api_tracklike l ON l.user_id = u.id
        LEFT JOIN api_playlist p ON p.user_id = u.id
        GROUP BY u.username
        ORDER BY engagement_score DESC
        LIMIT 10;
    """
    queries.append(("Most Active Users (Engagement Score)", run_query(q3)))

    # 4. Aggregates song durations to find which albums have the most content
    q4 = """
        SELECT al.title as album, 
               a.stage_name, 
               SUM(t.duration) / 60 || ' min' as total_duration
        FROM api_album al
        JOIN api_artist a ON al.artist_id = a.id
        JOIN api_track t ON t.album_id = al.id
        GROUP BY al.id, a.stage_name
        ORDER BY SUM(t.duration) DESC;
    """
    queries.append(("Longest Albums", run_query(q4)))

    # 5. Uses DATE_TRUNC to group play history into a daily timeline for the last week
    q5 = """
        SELECT DATE_TRUNC('day', played_at)::date as day, COUNT(id) as play_count
        FROM api_playhistory
        GROUP BY day
        ORDER BY day DESC
        LIMIT 7;
    """
    queries.append(("Recent Daily Play Counts", run_query(q5)))

    # 6. Combines counts from three different favorite tables into one single list
    q6 = """
        SELECT 'Track' as type, COUNT(*) as fav_count FROM api_favorite
        UNION ALL
        SELECT 'Artist', COUNT(*) FROM api_favoriteartist
        UNION ALL
        SELECT 'Playlist', COUNT(*) FROM api_favoriteplaylist;
    """
    queries.append(("Favorite Stats by Category", run_query(q6)))

    # 7. Identifies tracks that fall into multiple genres using HAVING for filtering
    q7 = """
        SELECT t.title, COUNT(tg.genre_id) as genre_count
        FROM api_track t
        JOIN api_trackgenre tg ON tg.track_id = t.id
        GROUP BY t.title
        HAVING COUNT(tg.genre_id) > 0
        ORDER BY genre_count DESC;
    """
    queries.append(("Multi-Genre Tracks", run_query(q7)))

    # 8. Simple filter to track which users have pending notifications to read
    q8 = """
        SELECT u.username, COUNT(n.id) as unread_count
        FROM api_user u
        JOIN api_notification n ON n.user_id = u.id
        WHERE n.is_read = False
        GROUP BY u.username
        ORDER BY unread_count DESC;
    """
    queries.append(("Unread Notifications", run_query(q8)))

    # 9. Ranks users with artist profiles based on their follower count
    q9 = """
        SELECT u.username as artist_user, COUNT(f.id) as followers
        FROM api_user u
        JOIN api_userfollow f ON f.following_id = u.id
        WHERE u.is_artist = True
        GROUP BY u.username
        ORDER BY followers DESC;
    """
    queries.append(("Top Artists by Followers", run_query(q9)))

    # 10. Uses a LEFT JOIN to find playlists that don't have any tracks added yet
    q10 = """
        SELECT p.name, u.username
        FROM api_playlist p
        JOIN api_user u ON p.user_id = u.id
        LEFT JOIN api_playlisttrack pt ON pt.playlist_id = p.id
        WHERE pt.id IS NULL;
    """
    queries.append(("Empty Playlists (Clean up needed)", run_query(q10)))

    # 11. Calculates the average song length for each artist's catalog
    q11 = """
        SELECT a.stage_name, ROUND(AVG(t.duration), 2) as avg_duration
        FROM api_artist a
        JOIN api_track t ON t.artist_id = a.id
        GROUP BY a.stage_name
        ORDER BY avg_duration DESC;
    """
    queries.append(("Average Song Length per Artist", run_query(q11)))

    # 12. Pulls the trending score for the current month and casts decimals to floats
    q12 = """
        SELECT t.title, tt.trend_score::float, tt.period
        FROM api_trendingtrack tt
        JOIN api_track t ON tt.track_id = t.id
        WHERE tt.period = 'monthly'
        ORDER BY tt.trend_score DESC;
    """
    queries.append(("Monthly Trending Heat", run_query(q12)))

    # 13. High-level overview of total records across the core tables
    q13 = """
        SELECT 'Users' as table, count(*) FROM api_user
        UNION SELECT 'Tracks', count(*) FROM api_track
        UNION SELECT 'Plays', count(*) FROM api_playhistory
        UNION SELECT 'Likes', count(*) FROM api_tracklike;
    """
    queries.append(("Database Record Overview", run_query(q13)))

    # 14. Filters for the most social users who follow more than one other person
    q14 = """
        SELECT u.username, COUNT(f.id) as following_count
        FROM api_user u
        JOIN api_userfollow f ON f.follower_id = u.id
        GROUP BY u.username
        HAVING COUNT(f.id) > 1
        ORDER BY following_count DESC;
    """
    queries.append(("Social Butterflies (Power Followers)", run_query(q14)))

    # 15. Fetches the 5 most recently created artist profiles for the 'new' section
    q15 = """
        SELECT stage_name, country, created_at::date
        FROM api_artist
        ORDER BY created_at DESC
        LIMIT 5;
    """
    queries.append(("Newest Artists on Platform", run_query(q15)))

    return render(request, "queries/dashboard.html", {"queries": queries})