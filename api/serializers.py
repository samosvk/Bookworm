from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id', 'code', 'host', 'guest_can_edit',
                   'created_at')

class CreateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('')
