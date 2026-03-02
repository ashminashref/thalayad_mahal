from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import (
    UserSerializer, AnnouncementSerializer, TeamSerializer, 
    BookSerializer, PaymentSerializer, CertificateRequestSerializer, 
    BookRequestSerializer, MedicalRequestSerializer, LoanRequestSerializer, 
    EducationProgramSerializer, FoodServiceSerializer
)
from .models import (
    User, Announcements, Team, Book, Payment, CertificateRequest, 
    GlobalFeeConfig, BookRequest, MedicalRequest, LoanRequest, 
    EducationProgram, FoodService, ProgramRegistration
)

# --- USER AUTHENTICATION & PROFILE ---

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        # 1. Welcome Mail to User
        try:
            subject = 'Welcome to Mahal Connect!'
            message = f'Assalamu Alaikum {user.first_name},\n\nYour account has been successfully created.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
        except Exception as e:
            print(f"DEBUG: User Welcome Email failed: {e}")

        # 2. Notification Mail to Admin
        try:
            admin_email = settings.EMAIL_HOST_USER 
            admin_subject = f'NEW USER REGISTRATION: {user.username}'
            admin_message = (
                f'A new user has registered:\n\n'
                f'Username: {user.username}\n'
                f'Name: {user.first_name} {user.last_name}\n'
                f'Email: {user.email}\n'
                f'Phone: {user.phone}'
            )
            send_mail(admin_subject, admin_message, settings.EMAIL_HOST_USER, [admin_email], fail_silently=False)
        except Exception as e:
            print(f"DEBUG: Admin Registration Notification failed: {e}")

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
            body = f'Assalamu Alaikum,\n\nA new announcement has been posted:\n\n{announcement.content}\n\nPriority: {announcement.priority.upper()}'
            try:
                email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], bcc=recipient_list)
                email.send()
            except Exception as e:
                print(f"Announcement Broadcast Failed: {e}")

class AnnouncementDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Announcements.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

# --- TEAMS ---

class TeamListCreateView(generics.ListCreateAPIView):
    queryset = Team.objects.all().order_by('-created_at')
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        team = serializer.save()
        recipient_list = list(User.objects.filter(is_active=True).values_list('email', flat=True))
        subject = f'NEW SERVICE TEAM: {team.team_name}'
        body = f'Assalamu Alaikum,\n\nA new volunteer team has been created: {team.team_name}\nPurpose: {team.occasion}\n\nDescription:\n{team.description}'
        try:
            email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], bcc=recipient_list)
            email.send()
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

    def perform_create(self, serializer):
        book = serializer.save()
        try:
            subject = f'NEW BOOK ADDED: {book.title}'
            message = f'A new record has been created in the library:\n\nTitle: {book.title}\nAuthor: {book.author}'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER])
        except Exception as e:
            print(f"Book Notification Failed: {e}")

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class BookRequestView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    serializer_class = BookRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return BookRequest.objects.all().order_by('-request_date')
        return BookRequest.objects.filter(user=self.request.user).order_by('-request_date')

    def perform_create(self, serializer):
        book_request = serializer.save(user=self.request.user)
        try:
            send_mail(
                f'NEW BOOK REQUEST: {book_request.book.title}',
                f'User {self.request.user.first_name} has requested to borrow "{book_request.book.title}".',
                settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER]
            )
        except: pass

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.refresh_from_db()
        status_val = instance.status.upper()
        book = instance.book

        if status_val == 'APPROVED':
            subject = f'Approved: Request for {book.title}'
            message = f'Assalamu Alaikum {instance.user.first_name}, your request for "{book.title}" is APPROVED. Visit Mahal Library between 4:30 PM - 6:30 PM.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.user.email])

        elif status_val == 'IN_HAND':
            if book.quantity > 0:
                book.quantity -= 1
                if book.quantity == 0: book.in_stock = False
                book.save()
            
        elif status_val == 'RETURNED':
            book.quantity += 1
            book.in_stock = True 
            book.save()

# --- PAYMENTS ---

class MyPaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).order_by('-submitted_at')

class AdminPaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all().order_by('-submitted_at')
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminUser]

class FeeConfigView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        config, created = GlobalFeeConfig.objects.get_or_create(id=1)
        return Response({"monthly": config.monthly_contribution, "madrassa": config.madrassa_fee})

    def put(self, request):
        config, created = GlobalFeeConfig.objects.get_or_create(id=1)
        config.monthly_contribution = request.data.get('monthly', config.monthly_contribution)
        config.madrassa_fee = request.data.get('madrassa', config.madrassa_fee)
        config.save()
        return Response({"message": "Fees updated successfully"})

# --- CERTIFICATES ---

class CertificateRequestView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        if self.request.user.is_staff:
            return CertificateRequest.objects.all().order_by('-created_at')
        return CertificateRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        try:
            subject = f'NEW CERTIFICATE REQUEST: {instance.certificate_type}'
            message = f'User {instance.full_name} has requested a {instance.certificate_type} certificate.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER])
        except: pass

    def perform_update(self, serializer):
        instance = serializer.save()
        status_val = instance.status.upper()
        if status_val in ['APPROVED', 'REJECTED']:
            subject = f'Certificate Update: {instance.certificate_type}'
            message = f'Assalamu Alaikum {instance.full_name},\n\nYour request for {instance.certificate_type} has been {status_val}.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.user.email])

class AdminCertificateRequestListView(generics.ListAPIView):
    queryset = CertificateRequest.objects.all().order_by('-created_at')
    serializer_class = CertificateRequestSerializer
    permission_classes = [IsAdminUser]

# --- MEDICAL REQUESTS ---

class MedicalRequestView(generics.ListCreateAPIView, generics.UpdateAPIView):
    serializer_class = MedicalRequestSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        if self.request.user.is_staff:
            return MedicalRequest.objects.all().order_by('-created_at')
        return MedicalRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        try:
            send_mail('Medical Support Request Received', f'Assalamu Alaikum,\nYour request for {instance.patient_name} is under review.', settings.EMAIL_HOST_USER, [self.request.user.email])
            send_mail('NEW MEDICAL REQUEST', f'From {self.request.user.username} for {instance.patient_name} (₹{instance.amount_needed}).', settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER])
        except: pass

    def perform_update(self, serializer):
        instance = serializer.save()
        try:
            subject = f'Medical Request Update: {instance.status}'
            message = f'Your request for {instance.patient_name} has been {instance.status}.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.user.email])
        except: pass

# --- LOAN REQUESTS ---

class LoanRequestView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    serializer_class = LoanRequestSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        if self.request.user.is_staff:
            return LoanRequest.objects.all().order_by('-created_at')
        return LoanRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        try:
            send_mail('Loan Application Submitted', f'Assalamu Alaikum,\nYour loan request for ₹{instance.amount_requested} is under review.', settings.EMAIL_HOST_USER, [self.request.user.email])
        except: pass

    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.status in ['APPROVED', 'REJECTED']:
            try:
                subject = f'Loan Request Update: {instance.status}'
                message = f'Your loan request for "{instance.loan_purpose}" has been {instance.status.lower()}.'
                send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.user.email])
            except: pass

# --- EDUCATION PROGRAMS ---

class ProgramListView(generics.ListCreateAPIView): 
    queryset = EducationProgram.objects.all().order_by('date')
    serializer_class = EducationProgramSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        program = serializer.save()
        recipient_list = list(User.objects.filter(is_active=True).values_list('email', flat=True))
        subject = f'NEW EDUCATIONAL PROGRAM: {program.title}'
        body = f'Assalamu Alaikum,\n\nA new class "{program.title}" by {program.teacher} is scheduled for {program.date} at {program.time}.'
        try:
            email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], bcc=recipient_list)
            email.send()
        except Exception as e:
            print(f"DEBUG: Program Notification Failed: {e}")

class RegisterProgramView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        program = get_object_or_404(EducationProgram, pk=pk)
        registration, created = ProgramRegistration.objects.get_or_create(user=request.user, program=program)
        if created:
            try:
                send_mail(f'Registration Confirmed: {program.title}', f'Assalamu Alaikum {request.user.first_name},\nYou registered for "{program.title}".', settings.EMAIL_HOST_USER, [request.user.email])
            except: pass
            return Response({"message": "Successfully registered"}, status=status.HTTP_201_CREATED)
        return Response({"message": "Already registered"}, status=status.HTTP_400_BAD_REQUEST)

# --- FOOD SERVICES ---

class FoodServiceListCreate(generics.ListCreateAPIView):
    queryset = FoodService.objects.all().order_by('-date')
    serializer_class = FoodServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        instance = serializer.save()
        recipient_list = list(User.objects.filter(is_active=True).exclude(email="").values_list('email', flat=True))
        if recipient_list:
            subject = f'Special Food Service: {instance.event_name}'
            body = (
                f'Assalamu Alaikum,\n\nWe are pleased to announce a food service for "{instance.event_name}".\n'
                f'Menu: {instance.food_name}\nDate: {instance.date}\nProvider: {instance.provider_name}\n\nNotes: {instance.notes}'
            )
            try:
                email = EmailMessage(subject, body, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER], bcc=recipient_list)
                email.send(fail_silently=False)
            except Exception as e:
                print(f"DEBUG: Food Service Email failed: {e}")

class FoodServiceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = FoodService.objects.all()
    serializer_class = FoodServiceSerializer
    permission_classes = [permissions.IsAuthenticated]