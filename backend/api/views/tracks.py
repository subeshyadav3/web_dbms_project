from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from django.utils import timezone
from datetime import timedelta

from api.models import Track, PlayHistory, Favorite, TrackStat
from api.serializers import TrackSerializer

class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=["get"], permission_classes=[permissions.IsAuthenticated])
    def favorites(self, request):
        favorites = Favorite.objects.filter(user=request.user).select_related(
            "track",
            "track__artist",
            "track__album",
            "track__trackstat",
        )

        tracks = [fav.track for fav in favorites]
        serializer = self.get_serializer(tracks, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def play(self, request, pk=None):
        track = self.get_object()
        now = timezone.now()

        
        track_stat, _ = TrackStat.objects.get_or_create(track=track)
        TrackStat.objects.filter(id=track_stat.id).update(total_plays=F('total_plays') + 1,
                                                        last_played_at=now)

        # Record the play
        PlayHistory.objects.create(user=request.user, track=track, played_at=now)

       
        weekly = PlayHistory.objects.filter(track=track, played_at__gte=now - timedelta(days=7)).count()
        monthly = PlayHistory.objects.filter(track=track, played_at__gte=now - timedelta(days=30)).count()

        TrackStat.objects.filter(id=track_stat.id).update(weekly_plays=weekly, monthly_plays=monthly)

        track_stat.refresh_from_db()
        return Response({
            "status": "played",
            "total_plays": track_stat.total_plays,
            "weekly_plays": track_stat.weekly_plays,
            "monthly_plays": track_stat.monthly_plays
        }, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def favorite(self, request, pk=None):
        track = self.get_object()

        favorite, created = Favorite.objects.get_or_create(user=request.user, track=track)
        if not created:
            return Response({"detail": "Already favorited"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"status": "favorited"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["delete"], permission_classes=[permissions.IsAuthenticated])
    def unfavorite(self, request, pk=None):
        track = self.get_object()
        Favorite.objects.filter(user=request.user, track=track).delete()
        return Response({"status": "unfavorited"}, status=status.HTTP_204_NO_CONTENT)