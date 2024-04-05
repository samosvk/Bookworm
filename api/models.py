from django.db import models
import string
import random
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    users = models.ManyToManyField('auth.User', related_name='books')

class Element(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    element_type = models.CharField(max_length=100, default=None)
    priority = models.PositiveIntegerField()  # Priority attribute added

    def save(self, *args, **kwargs):
        if not self.pk:  # Only execute on creation, not update
            # Calculate priority when creating a new element
            max_priority = Element.objects.filter(book=self.book).aggregate(models.Max('priority'))['priority__max']
            if max_priority is None:
                self.priority = 1
            else:
                self.priority = max_priority + 1

        if isinstance(self.content_object, MultipleChoice):
            self.element_type = 'MultipleChoice'
        elif isinstance(self.content_object, Text):
            self.element_type = 'Text'
        elif isinstance(self.content_object, FillBlank):
            self.element_type = 'FillBlank'

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # When an element is deleted, adjust priorities of elements with higher priority
        higher_priority_elements = Element.objects.filter(book=self.book, priority__gt=self.priority)
        for higher_priority_element in higher_priority_elements:
            higher_priority_element.priority -= 1
            higher_priority_element.save()

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
    
