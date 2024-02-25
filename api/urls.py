from django.urls import path
from .views import BookView, ElementsView

urlpatterns = [
    path('book/', BookView.as_view()),
    path('element/<int:book_id>/', BookView.as_view()),
    path('element/<int:book_id>/<int:element_id>', ElementsView.as_view())
]