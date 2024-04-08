from django.shortcuts import render
from rest_framework import generics
from .serializers import * 
from .models import Book, Element, Text, MultipleChoice, FillBlank
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework import status
import jwt
from django.views.decorators.csrf import csrf_exempt

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_id = request.user.id
        user = User.objects.get(id=user_id)
        return Response({'username': user.username,
                          'is_superuser': user.is_superuser})
class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_id = request.user.id
            user = User.objects.get(id=user_id)
            queryset = Book.objects.all()
            book_serializer = BookSerializer(queryset, many=True)
            return Response({'username': user.username, 'books': book_serializer.data, 'is_superuser': user.is_superuser})

        except Exception as e:
            return Response({'error': str(e)}, status=400) 
class BookView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, book_id):
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"},status=status.HTTP_404_NOT_FOUND)
        #get book and element data for the specified book and order the elements by priority for rendering
        elements = Element.objects.filter(book=book).order_by('priority')
        book_serializer = BookSerializer(book)
        element_serializer = ElementSerializer(elements, many=True)
        #remove answers from element data so client can't see them
        [element['content_object'].pop('answer', None) for element in element_serializer.data]
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
    
    #Change the order of the elements
    def put(self, request, book_id, element_id):
        #get the elements and their new order
        element_1 = Element.objects.get(pk=element_id, book_id=book_id)
        current_priority = element_1.priority
        direction = request.data.get('direction')
        if direction not in [1, -1]:
            return Response({"error": "Invalid direction"}, status=status.HTTP_400_BAD_REQUEST)
        new_priority = current_priority + direction
        try:
            # get the element with the new priority
            element_2 = Element.objects.get(priority=new_priority, book_id=book_id)
            # swap the priorities of the two elements
            element_1.priority, element_2.priority = element_2.priority, element_1.priority
            element_1.save()
            element_2.save()
        except Element.DoesNotExist:
            return Response({"error": "Invalid priority"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_200_OK)

#used for crud operations on the book's info rather than elements
class CreateBookView(APIView):
    serializer_class = CreateBookSerializer
    #make a book
    def post(self, request):
        try:
            book = Book.objects.create(title=request.data['title'])
        except Exception as e:
            return Response({'error': str(e)}, status=400)
        return Response(status=status.HTTP_201_CREATED)
    def delete(self, request, book_id):
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"},status=status.HTTP_404_NOT_FOUND)
        book.delete()
        return Response(status=status.HTTP_200_OK)

    
class EditorView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request, book_id):
        try:
            book = Book.objects.get(pk=book_id)
        except Book.DoesNotExist:
            return Response({"error": "Book not found"},status=status.HTTP_404_NOT_FOUND)
        #get book and element data for the specified book and order the elements by priority for rendering
        elements = Element.objects.filter(book=book).order_by('priority')
        book_serializer = BookSerializer(book)
        element_serializer = ElementSerializer(elements, many=True)
        #add book data and associated element data to the response
        response_data = {
            "book": book_serializer.data,
            "elements": element_serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)

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
        element_type = request.data.get('type')
        #get the provided fields for the element
        fields = request.data.get('element')

        #get serializer for the associated type of the elements
        serializer_class = self.get_serializer_class(element_type)
        if serializer_class is None:
            return Response({"error": "Element type not found"}, status=status.HTTP_400_BAD_REQUEST)
        #create the element and return response
        serializer = serializer_class(data={'book': book.id, **fields})
        if serializer.is_valid():
            new_element = serializer.save()
            creation = Element.objects.create(book=book, content_object=new_element)
            return Response(ElementSerializer(creation).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    #assign serializer for the associated type of the elements
    def get_serializer_class(self, element_type):
        serializers_map = {
            'Text': TextSerializer,
            'FillBlank': FillBlankSerializer,
            'MultipleChoice': MultipleChoiceSerializer,
        }
        return serializers_map.get(element_type)
    # handle update of element
    def put(self, request, book_id, element_id):
        try:
            element = Element.objects.get(pk=element_id, book_id=book_id)
        except Element.DoesNotExist:
            return Response({"error": "Element not found"},status=status.HTTP_404_NOT_FOUND)
        for attribute, value in request.data.items():
            if hasattr(element.content_object, attribute):
                if attribute == 'options':
                    #split the options by comma and remove any leading or trailing spaces
                    setattr(element.content_object, attribute, [option.strip() for option in value.split(",")])
                else:
                    setattr(element.content_object, attribute, value)
        element.content_object.save()
        return Response(status=status.HTTP_200_OK)