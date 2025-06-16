from django.urls import path
from . import views

urlpatterns = [
    path('quotes/', views.QuoteListView.as_view(), name='quote-list'),
    path('quotes/random/', views.RandomQuoteView.as_view(), name='random-quote'),
    path('goals/', views.GoalListCreateView.as_view(), name='goal-list-create'),
    path('goals/<int:pk>/', views.GoalDetailView.as_view(), name='goal-detail'),
] 