from django.urls import path
from .views import BookView, EditorView, DashboardView

urlpatterns = [
    path('book/<int:book_id>/', BookView.as_view()),
    path('book/<int:book_id>/<int:element_id>', BookView.as_view()),
    path('editor/<int:book_id>/', EditorView.as_view()),
    path('editor/<int:book_id>/<int:element_id>', EditorView.as_view()),
    path('dashboard/', DashboardView.as_view()),
]