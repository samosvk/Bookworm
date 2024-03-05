from django.shortcuts import render
from rest_framework import generics
from .serializers import BookSerializer, CreateBookSerializer, ElementSerializer
from .models import Book, Element, Text, MultipleChoice, FillBlank
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt

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

    #Check if the answer is correct
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

class CreateBookView(APIView):
    serializer_class = CreateBookSerializer

    def post(self, request, format=None):
        pass

    
class EditorView(APIView):
    # handle delete of element
    def delete(self, request, book_id, element_id):
        try:
            element = Element.objects.get(pk=element_id, book_id=book_id)
        except Element.DoesNotExist:
            return Response({"error": "Element not found"},status=status.HTTP_404_NOT_FOUND)
        #delete the element and return response
        element.delete() 
        return Response(status=status.HTTP_200_OK)
    
    # handle creation of element
    def post(self, request, book_id):
        book = Book.objects.get(pk=book_id)
        fields = request.data.get('element')
        print(request.data)
        if request.data.get('type') == 'Text':
            new_element = Text.objects.create(book=book, 
                                              text=fields.get('text'))
        elif request.data.get('type') == 'FillBlank':
            new_element = FillBlank.objects.create(book=book, 
                                                   question=fields.get('question'),
                                                   answer=fields.get('answer'))
        elif request.data.get('type') == 'MultipleChoice':
            new_element = MultipleChoice.objects.create(book=book,
                                                        question=fields.get('question'),
                                                        answer=fields.get('answer'), 
                                                        options = fields.get('options'))
        else:
            return Response({"error": "Element type not found"},status=status.HTTP_400_BAD_REQUEST)
        print('hello')
        creation = Element.objects.create(book=book, content_object=new_element)
        return Response(status=status.HTTP_201_CREATED)

    # handle update of element
    def put(self, request, book_id, element_id):
        pass
