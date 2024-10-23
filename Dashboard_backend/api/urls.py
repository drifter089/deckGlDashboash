from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BusViewSet, LineViewSet, TotalGenerationByAcBusViewSet,
    GenerationMixViewSet, TotalDemandViewSet
)

router = DefaultRouter()
router.register(r'buses', BusViewSet)
router.register(r'lines', LineViewSet)
router.register(r'total-generation', TotalGenerationByAcBusViewSet)
router.register(r'generation-mix', GenerationMixViewSet)
router.register(r'total-demand', TotalDemandViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
