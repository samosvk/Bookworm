from django.shortcuts import render
from rest_framework import generics
from .serializers import BookSerializer, CreateBookSerializer, ElementSerializer
from .models import Book, Element
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

class ElementsView(APIView):
    def get(self, request, book_id):
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"},status=status.HTTP_404_NOT_FOUND)
        elements = Element.objects.filter(book=book)
        serializer = ElementSerializer(elements, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
