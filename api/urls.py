from django.urls import path
from .views import BookView, ElementsView

urlpatterns = [
    path('book/', BookView.as_view()),
    path('element/<int:book_id>/', ElementsView.as_view())
]