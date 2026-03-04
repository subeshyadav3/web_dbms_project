from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    ProfileView,
    UserTokenObtainPairView,
    UserViewSet,
    TrackViewSet,
    PlaylistViewSet,
    ArtistViewSet,
    AlbumViewSet,
    TrendingTrackViewSet,
)

router = DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"tracks", TrackViewSet)
router.register(r"playlists", PlaylistViewSet)
router.register(r"artists", ArtistViewSet)
router.register(r"albums", AlbumViewSet)
router.register(r"trending", TrendingTrackViewSet, basename="trending")

urlpatterns = [
    path("auth/register/", RegisterView.as_view()),
    path("auth/login/", UserTokenObtainPairView.as_view()),
    path("auth/refresh/", TokenRefreshView.as_view()),
    path("auth/profile/", ProfileView.as_view()),
    path("", include(router.urls)),
]