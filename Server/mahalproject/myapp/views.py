from django.core.mail import send_mail
from django.conf import settings
from django.db.models import Q
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import (
    UserSerializer, AnnouncementSerializer, TeamSerializer, 
    BookSerializer, PaymentSerializer, CertificateRequestSerializer
)
from .models import (
    User, Announcements, Team, Book, Payment, CertificateRequest
)

# --- USER AUTHENTICATION & PROFILE ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        try:
            subject = 'Welcome to Mahal Connect!'
            message = f'Assalamu Alaikum {user.first_name},\n\nYour account has been successfully created.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
        except Exception as e:
            print(f"Registration Email failed: {e}")

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

# --- ANNOUNCEMENTS ---

class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcements.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer

    def perform_create(self, serializer):
        announcement = serializer.save()
        if announcement.status == 'published':
            recipient_list = list(User.objects.filter(is_active=True).values_list('email', flat=True))
            subject = f'NEW ANNOUNCEMENT: {announcement.title}'
            message = f'Assalamu Alaikum,\n\nA new announcement has been posted:\n\n{announcement.content}\n\nPriority: {announcement.priority.upper()}'
            try:
                send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
            except Exception as e:
                print(f"Announcement Broadcast Failed: {e}")

class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Announcements.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

# --- TEAMS & SERVICES ---

class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Team.objects.all().order_by('-created_at')
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        team = serializer.save()
        # Notify all members about the new service team
        recipient_list = list(User.objects.filter(is_active=True).values_list('email', flat=True))
        subject = f'NEW SERVICE TEAM: {team.team_name}'
        message = (
            f'Assalamu Alaikum,\n\nA new service or volunteer team has been created: {team.team_name}\n'
            f'Purpose: {team.occasion}\n\nDescription:\n{team.description}'
        )
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
        except Exception as e:
            print(f"Team Creation Email Failed: {e}")

class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

# --- LIBRARY / BOOKS ---

class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- PAYMENTS ---

class MyPaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).order_by('-submitted_at')

# --- CERTIFICATE REQUESTS ---

# Server/mahalproject/myapp/views.py

# Server/mahalproject/myapp/views.py
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import CertificateRequest
from .serializers import CertificateRequestSerializer

class CertificateRequestView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        if self.request.user.is_staff:
            return CertificateRequest.objects.all().order_by('-created_at')
        return CertificateRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # 1. Save the instance first
        instance = serializer.save()
        
        # 2. Force refresh from DB to ensure we aren't looking at old state
        instance.refresh_from_db()
        
        status_val = instance.status.upper()
        
        # 3. Only send mail if status is officially changed in DB
        if status_val in ['APPROVED', 'REJECTED']:
            subject = f'Certificate Update: {instance.certificate_type} Certificate'
            message = f'Assalamu Alaikum {instance.full_name},\n\nYour submission of {instance.certificate_type} Certificate has been {status_val}. View your profile for more'
            
            try:
                # Use fail_silently=False to see errors in terminal
                send_mail(
                    subject, 
                    message, 
                    settings.EMAIL_HOST_USER, 
                    [instance.user.email], 
                    fail_silently=False 
                )
                print(f"DEBUG: Email successfully triggered for {instance.user.email}")
            except Exception as e:
                print(f"DEBUG: Email error: {str(e)}")

class AdminCertificateRequestListView(generics.ListAPIView):
    queryset = CertificateRequest.objects.all().order_by('-created_at')
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAdminUser]

