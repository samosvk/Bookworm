from rest_framework import serializers
from .models import Book, Text, MultipleChoice, Element

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('book_id', 'title','created_at')

class CreateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('')

class MultipleChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoice
        fields = '__all__'

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = '__all__'

class ElementSerializer(serializers.ModelSerializer):
    content_object = serializers.SerializerMethodField()

    def get_content_object(self, obj):
        serializer_class = self.get_serializer_for_instance(obj.content_object)
        if serializer_class is not None:
            serializer = serializer_class(obj.content_object)
            return serializer.data
        return None
    
    def get_serializer_for_instance(self, instance):
        serializers_map ={
            MultipleChoice: MultipleChoiceSerializer,
            Text: TextSerializer
        }
        return serializers_map.get(type(instance), None)
    class Meta:
        model = Element
        fields = '__all__'
