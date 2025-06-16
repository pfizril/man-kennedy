from rest_framework import generics, permissions
from django.db.models import Count
from .models import Quote, Goal
from .serializers import QuoteSerializer, GoalSerializer

class QuoteListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

class RandomQuoteView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = QuoteSerializer

    def get_object(self):
        return Quote.objects.order_by('?').first()

class GoalListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class GoalDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = GoalSerializer

    def get_queryset(self):
        return Goal.objects.filter(user=self.request.user) 