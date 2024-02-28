from django.db import models
import string
import random
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class Element(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    element_type = models.CharField(max_length=100, default=None)

    def save(self, *args, **kwargs):
        # Automatically set the element_type based on the type of content_object being saved
        if isinstance(self.content_object, MultipleChoice):
            self.element_type = 'MultipleChoice'
        elif isinstance(self.content_object, Text):
            self.element_type = 'Text'
        elif isinstance(self.content_object, FillBlank):
            self.element_type = 'FillBlank'

        super().save(*args, **kwargs)
        
    def delete(self, *args, **kwargs):
        # Delete the content_object before deleting the element
        #This will delete the MultipleChoice or Text instance associated with the element
        self.content_object.delete()
        super().delete(*args, **kwargs)
    

class MultipleChoice(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    element = GenericRelation(Element)
    question = models.TextField()
    answer = models.CharField(max_length=100, default=None)
    options = models.JSONField()

class Text(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    element = GenericRelation(Element)
    text = models.TextField()

class FillBlank(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    element = GenericRelation(Element)
    question = models.TextField()
    answer = models.CharField(max_length=100, default=None)
    
