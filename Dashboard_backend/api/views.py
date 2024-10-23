from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
import requests
from django.contrib.gis.geos import Polygon
from .models import Bus, Line, TotalGenerationByAcBus, GenerationMix, TotalDemand
from .serializers import BusSerializer, LineSerializer, TotalGenerationByAcBusSerializer, GenerationMixSerializer, TotalDemandSerializer

# Create your views here.
from rest_framework import viewsets

class BusViewSet(viewsets.ModelViewSet):
  queryset = Bus.objects.all()
  serializer_class = BusSerializer

class LineViewSet(viewsets.ModelViewSet):
  queryset = Line.objects.all()
  serializer_class = LineSerializer

class TotalGenerationByAcBusViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = TotalGenerationByAcBus.objects.all()
  serializer_class = TotalGenerationByAcBusSerializer

  def list(self, request, *args, **kwargs):
      queryset = self.get_queryset()
      print(f"Number of records: {queryset.count()}")  
      serializer = self.get_serializer(queryset, many=True)
      return Response(serializer.data)

class GenerationMixViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = GenerationMix.objects.all()
  serializer_class = GenerationMixSerializer

class TotalDemandViewSet(viewsets.ReadOnlyModelViewSet):
  queryset = TotalDemand.objects.all()
  serializer_class = TotalDemandSerializer

def geoserver_proxy(request):
    geoserver_url = "http://34.31.13.149:8000/geoserver/GIS_Dashboard/ows"
    params = request.GET.dict()
    response = requests.get(geoserver_url, params=params)
    return HttpResponse(response.content, content_type=response.headers['Content-Type'])
