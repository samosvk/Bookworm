import os
import django

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookworm.settings')
django.setup()

# Import your models after setup
from api.models import Book, Element, MultipleChoice, Text

# Create a book instance
book = Book.objects.create(title="Sample Book")

# Create a multiple choice instance
multiple_choice = MultipleChoice.objects.create(
    book=book,
    question="What is the largest number?",
    answer='4',
    options=['1', '2', '3', '4']
)

# Create a text instance
text = Text.objects.create(book=book, text="This is some sample text.\n I am just testing")

# Create an element instance associated with the book and multiple choice instance
element_multiple_choice = Element.objects.create(book=book, content_object=multiple_choice)

# Create another element instance associated with the book and text instance
element_text = Element.objects.create(book=book, content_object=text)

# Output success message
print("Data populated successfully!")
