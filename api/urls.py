from django.urls import path
from .views import BookView, EditorView, DashboardView, UserInfoView, CreateBookView

urlpatterns = [
    path('book/<int:book_id>/', BookView.as_view()),
    path('book/<int:book_id>/<int:element_id>', BookView.as_view()),
    path('create_book/', CreateBookView.as_view()),  
    path('create_book/<int:book_id>/', CreateBookView.as_view()),
    path('editor/<int:book_id>/', EditorView.as_view()),
    path('editor/<int:book_id>/<int:element_id>', EditorView.as_view()),
    path('dashboard/', DashboardView.as_view()),
    path('user_info/', UserInfoView.as_view()),
]