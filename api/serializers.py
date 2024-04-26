from rest_framework import serializers
from .models import Book, Text, MultipleChoice, Element, FillBlank, Video

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('id','title','created_at')

class CreateBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('')

class MultipleChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoice
        fields = ('book', 'question', 'options', 'answer') 

class TextSerializer(serializers.ModelSerializer):
    class Meta:
        model = Text
        fields = ('book', 'text')

class FillBlankSerializer(serializers.ModelSerializer):
    class Meta:
        model = FillBlank
        fields = ('book', 'question', 'answer')

class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ('book', 'url')

class ElementSerializer(serializers.ModelSerializer):
    #call get_conent_object to get the content of the element
    content_object = serializers.SerializerMethodField()

    #retrieve content for specific type of element
    def get_content_object(self, obj):
        serializer_class = self.get_serializer_for_instance(obj.content_object)
        if serializer_class is not None:
            serializer = serializer_class(obj.content_object)
            return serializer.data
        return None
    
    #assign serializer for the associated type of the elements
    def get_serializer_for_instance(self, instance):
        serializers_map ={
            MultipleChoice: MultipleChoiceSerializer,
            Text: TextSerializer,
            FillBlank: FillBlankSerializer,
            Video: VideoSerializer
        }
        return serializers_map.get(type(instance), None)
    class Meta:
        model = Element
        fields = ('id','book', 'content_object', 'element_type')
