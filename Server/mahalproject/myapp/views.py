from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, AnnouncementSerializer
from .models import User, Announcements

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        try:
            subject = 'Welcome to Mahal Connect!'
            message = f'Assalamu Alaikum {user.first_name},\n\nYour account has been successfully created.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email])
        except Exception as e:
            print(f"Email failed: {e}")

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



# admin
from django.core.mail import send_mail
from django.conf import settings

class AnnouncementListCreateView(generics.ListCreateAPIView):
    queryset = Announcements.objects.all().order_by('-created_at')
    serializer_class = AnnouncementSerializer

    def perform_create(self, serializer):
        # 1. Save the announcement to the DB
        announcement = serializer.save()

        # 2. Only send emails if status is 'published'
        if announcement.status == 'published':
            # Get all member emails
            recipient_list = list(User.objects.filter(is_active=True).values_list('email', flat=True))
            
            subject = f'NEW ANNOUNCEMENT: {announcement.title}'
            message = f'Assalamu Alaikum,\n\nA new announcement has been posted:\n\n{announcement.content}\n\nPriority: {announcement.priority.upper()}'
            
            try:
                send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
            except Exception as e:
                print(f"Email Broadcast Failed: {e}")

class AnnouncementDeleteView(generics.DestroyAPIView):
    queryset = Announcements.objects.all()
    serializer_class = AnnouncementSerializer    