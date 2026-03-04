from rest_framework.viewsets import ReadOnlyModelViewSet
from api.models import TrendingTrack
from api.serializers import TrendingTrackSerializer


class TrendingTrackViewSet(ReadOnlyModelViewSet):
    serializer_class = TrendingTrackSerializer

    def get_queryset(self):
        period = self.request.query_params.get("period", "daily")
        return (
            TrendingTrack.objects
            .select_related("track__artist")
            .filter(period=period)
            .order_by("-trend_score")
        )