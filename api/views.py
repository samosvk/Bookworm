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

class BookView(APIView):
    def get(self, request, book_id):
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"},status=status.HTTP_404_NOT_FOUND)
        #get book and element data for the specified book
        elements = Element.objects.filter(book=book)
        book_serializer = BookSerializer(book)
        element_serializer = ElementSerializer(elements, many=True)
        #add book data and associated element data to the response
        response_data = {
            "book": book_serializer.data,
            "elements": element_serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)

class CreateBookView(APIView):
    serializer_class = CreateBookSerializer

    def post(self, request, format=None):
        pass

class ElementsView(APIView):
    #check if the answer is correct
    def post(self, request, book_id, element_id):
        #check if the element exists
        try:
            element = Element.objects.get(pk=element_id, book_id=book_id)
        except Element.DoesNotExist:
            return Response({"error": "Element not found"},status=status.HTTP_404_NOT_FOUND)
        
        #get the option submitted by the user and check its correctness
        submitted_option = request.data.get('option',None)
        if not submitted_option:
            return Response({"error": "Option not found"},status=status.HTTP_400_BAD_REQUEST)
        #check if answer is correct 
        if element.content_object.answer == submitted_option:
            return Response({"is_correct": True}, status=status.HTTP_200_OK)
        return Response({"is_correct": False}, status=status.HTTP_200_OK)
    
