from django.shortcuts import render
from rest_framework import generics
from .serializers import BookSerializer, CreateBookSerializer
from .models import Book
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

class BookView(generics.CreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

class CreateBookView(APIView):
    serializer_class = CreateBookSerializer

    def post(self, request, format=None):
        pass
