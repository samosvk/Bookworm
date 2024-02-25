from rest_framework import serializers
from .models import Book, Text, MultipleChoice, Element

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('title','created_at')

class CreateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('')

class MultipleChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoice
        fields = ('book', 'question', 'options') 

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ('book', 'text')

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
        fields = ('id','book', 'content_object', 'element_type')
