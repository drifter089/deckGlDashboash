from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

# Create your tests here.

class APIEndpointsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_buses_endpoint(self):
        response = self.client.get(reverse('bus-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_lines_endpoint(self):
        response = self.client.get(reverse('line-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)