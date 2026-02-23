from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.db.models import Q
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .serializers import (
    UserSerializer, AnnouncementSerializer, TeamSerializer, 
    BookSerializer, PaymentSerializer, CertificateRequestSerializer, BookRequestSerializer
)
from .models import (
    User, Announcements, Team, Book, Payment, CertificateRequest, GlobalFeeConfig, BookRequest
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
            print(f"DEBUG: Welcome email sent to {user.email}")
        except Exception as e:
            print(f"DEBUG: User Welcome Email failed: {e}")

        # 2. Notification Mail to Admin
        try:
            # Explicitly set the admin email address here if settings.EMAIL_HOST_USER isn't working
            admin_email = settings.EMAIL_HOST_USER 
            admin_subject = f'NEW USER REGISTRATION: {user.username}'
            admin_message = (
                f'A new user has registered on Mahal Connect:\n\n'
                f'Username: {user.username}\n'
                f'Name: {user.first_name} {user.last_name}\n'
                f'Email: {user.email}\n'
                f'Phone: {user.phone}'
            )
            
            send_mail(
                admin_subject, 
                admin_message, 
                settings.EMAIL_HOST_USER, 
                [admin_email], # Ensure this list contains the admin's actual address
                fail_silently=False
            )
            print(f"DEBUG: Admin notification sent to {admin_email}")
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
            # Updated to use BCC for Privacy [New Update]
            recipient_list = list(User.objects.filter(is_active=True).values_list('email', flat=True))
            subject = f'NEW ANNOUNCEMENT: {announcement.title}'
            body = f'Assalamu Alaikum,\n\nA new announcement has been posted:\n\n{announcement.content}\n\nPriority: {announcement.priority.upper()}'
            
            try:
                email = EmailMessage(
                    subject=subject,
                    body=body,
                    from_email=settings.EMAIL_HOST_USER,
                    to=[settings.EMAIL_HOST_USER], # Primary 'To' is the sender or a generic office mail
                    bcc=recipient_list, # Users are BCC'd so they cannot see each other
                )
                email.send()
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
        # Updated to use BCC for Privacy [New Update]
        recipient_list = list(User.objects.filter(is_active=True).values_list('email', flat=True))
        subject = f'NEW SERVICE TEAM: {team.team_name}'
        body = (
            f'Assalamu Alaikum,\n\nA new service or volunteer team has been created: {team.team_name}\n'
            f'Purpose: {team.occasion}\n\nDescription:\n{team.description}'
        )
        try:
            email = EmailMessage(
                subject=subject,
                body=body,
                from_email=settings.EMAIL_HOST_USER,
                to=[settings.EMAIL_HOST_USER],
                bcc=recipient_list,
            )
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
        # Notify Admin about new book request/addition [New Update]
        try:
            subject = f'NEW BOOK ADDED/REQUESTED: {book.title}'
            message = f'A new record has been created in the library:\n\nTitle: {book.title}\nAuthor: {book.author}'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER])
        except Exception as e:
            print(f"Book Notification Failed: {e}")

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

# --- BOOK BORROWING REQUESTS (NEW) ---

# --- BOOK BORROWING REQUESTS WITH INVENTORY LOGIC ---

class BookRequestView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    serializer_class = BookRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Admin sees all requests, Users see only their own
        if self.request.user.is_staff:
            return BookRequest.objects.all().order_by('-request_date')
        return BookRequest.objects.filter(user=self.request.user).order_by('-request_date')

    def perform_create(self, serializer):
        # Save the request and link it to the logged-in user
        book_request = serializer.save(user=self.request.user)
        # Notify Admin about the new request
        try:
            send_mail(
                f'NEW BOOK REQUEST: {book_request.book.title}',
                f'User {self.request.user.first_name} has requested to borrow "{book_request.book.title}".\nPlease review this in the Admin Dashboard.',
                settings.EMAIL_HOST_USER,
                [settings.EMAIL_HOST_USER],
                fail_silently=False
            )
        except Exception as e: 
            print(f"Book Request Admin Notify Error: {e}")

    def perform_update(self, serializer):
        # 1. Save the new status
        instance = serializer.save()
        instance.refresh_from_db()
        status_val = instance.status.upper()
        book = instance.book

        # 2. Logic for APPROVAL: Notify user (Quantity decreased here or in IN_HAND)
        if status_val == 'APPROVED':
            # Logic for email remains same
            subject = f'Approved: Request for {book.title}'
            message = f'Assalamu Alaikum {instance.user.first_name}, your request for "{book.title}" is APPROVED. Visit Mahal Library between 4:30 PM - 6:30 PM.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.user.email])

        # 3. Logic for IN_HAND: User physically took the book
        elif status_val == 'IN_HAND':
            if book.quantity > 0:
                book.quantity -= 1
                if book.quantity == 0:
                    book.in_stock = False
                book.save()
            
        # 4. Logic for RETURNED: User brought the book back
        elif status_val == 'RETURNED':
            book.quantity += 1
            book.in_stock = True # Always True if quantity increases from 0
            book.save()

                
                # 3. Notify the user about approval and specific library timing
            subject = f'Approved: Request for {book.title}'
            message = (
                    f'Assalamu Alaikum {instance.user.first_name},\n\n'
                    f'Your request for the book "{book.title}" has been APPROVED. '
                    f'You can visit the Mahal Library and borrow the book from 4:30 PM to 6:30 PM.\n\n'
                    f'Happy reading!'
                )
            try:
                    send_mail(subject, message, settings.EMAIL_HOST_USER, [instance.user.email])
            except Exception as e: 
                    print(f"Approval Mail Error: {e}")
            else:
                # Fallback if admin tries to approve an already out-of-stock item
                print(f"DEBUG: Approval failed - {book.title} is already out of stock.")  

# --- PAYMENTS ---

class MyPaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user).order_by('-submitted_at')


class CertificateRequestView(generics.ListCreateAPIView, generics.RetrieveUpdateAPIView):
    serializer_class = CertificateRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        if self.request.user.is_staff:
            return CertificateRequest.objects.all().order_by('-created_at')
        return CertificateRequest.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        # Notify Admin about new certificate request [New Update]
        try:
            subject = f'NEW CERTIFICATE REQUEST: {instance.certificate_type}'
            message = f'User {instance.full_name} has requested a {instance.certificate_type} certificate.'
            send_mail(subject, message, settings.EMAIL_HOST_USER, [settings.EMAIL_HOST_USER])
        except Exception as e:
            print(f"Certificate Admin Notification Failed: {e}")

    def perform_update(self, serializer):
        instance = serializer.save()
        instance.refresh_from_db()
        status_val = instance.status.upper()
        
        if status_val in ['APPROVED', 'REJECTED']:
            subject = f'Certificate Update: {instance.certificate_type} Certificate'
            message = f'Assalamu Alaikum {instance.full_name},\n\nYour submission of {instance.certificate_type} Certificate has been {status_val}. View your profile for more info.'
            
            try:
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

# --- ADMIN PAYMENT & FEE CONFIG ---

class AdminPaymentListView(generics.ListAPIView):
    queryset = Payment.objects.all().order_by('-submitted_at')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAdminUser]

class FeeConfigView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        config, created = GlobalFeeConfig.objects.get_or_create(id=1)
        return Response({
            "monthly": config.monthly_contribution,
            "madrassa": config.madrassa_fee
        })

    def put(self, request):
        config, created = GlobalFeeConfig.objects.get_or_create(id=1)
        config.monthly_contribution = request.data.get('monthly', config.monthly_contribution)
        config.madrassa_fee = request.data.get('madrassa', config.madrassa_fee)
        config.save()
        return Response({"message": "Fees updated successfully"})