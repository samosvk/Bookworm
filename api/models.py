from django.db import models
import string
import random
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

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

    class Meta:
        unique_together = ('book', 'id')

    def save(self, *args, **kwargs):
        # Automatically set the element_type based on the type of content_object being saved
        if isinstance(self.content_object, MultipleChoice):
            self.element_type = 'MultipleChoice'
        elif isinstance(self.content_object, Text):
            self.element_type = 'Text'

        super().save(*args, **kwargs)

class MultipleChoice(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100, default=None)
    options = models.JSONField()

class Text(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000000)
