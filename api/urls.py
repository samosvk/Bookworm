from django.urls import path
from .views import BookView, ElementsView, EditorView

urlpatterns = [
    path('book/', BookView.as_view()),
    path('book/<int:book_id>/', BookView.as_view()),
    path('element/<int:book_id>/<int:element_id>', ElementsView.as_view()),
    path('editor/<int:book_id>/<int:element_id>', EditorView.as_view())
]