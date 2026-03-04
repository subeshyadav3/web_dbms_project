from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F

from api.models import Track, PlayHistory, Favorite, TrackStat
from api.serializers import TrackSerializer

class TrackViewSet(viewsets.ModelViewSet):
    queryset = Track.objects.all()
    serializer_class = TrackSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def play(self, request, pk=None):
        track = self.get_object()

        # Increment stats total_plays atomically
        track_stat, created = TrackStat.objects.get_or_create(track=track)
        TrackStat.objects.filter(id=track_stat.id).update(total_plays=F('total_plays') + 1)

        # Create play history record
        PlayHistory.objects.create(user=request.user, track=track)

        # Refresh from db to get updated value
        track_stat.refresh_from_db()

        return Response({"status": "played", "total_plays": track_stat.total_plays}, status=status.HTTP_200_OK)

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