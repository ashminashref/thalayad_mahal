from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    # --- AUTH ---
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),

    # --- ANNOUNCEMENTS ---
    path('announcements/', AnnouncementListCreateView.as_view(), name='announcements'),
    path('announcements/<int:pk>/', AnnouncementDetailView.as_view(), name='announcement-detail'),

    # --- USERS ---
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDeleteView.as_view(), name='user-delete'),

    # --- TEAMS ---
    path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),

    # --- BOOKS & REQUESTS ---
    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    # FIXED: Added the missing book request endpoints
    path('book-requests/', BookRequestView.as_view(), name='book-requests'),
    path('book-requests/<int:pk>/', BookRequestView.as_view(), name='book-request-detail'),

    # --- PAYMENTS ---
    path('my-payments/', MyPaymentListView.as_view(), name='my-payments'),
    path('admin/payments/', AdminPaymentListView.as_view(), name='admin-payments'),
    path('admin/fee-config/', FeeConfigView.as_view(), name='admin-fee-config'),

    # --- CERTIFICATES ---
    path('certificate-requests/', CertificateRequestView.as_view(), name='cert-requests'),
    path('admin/certificate-requests/', AdminCertificateRequestListView.as_view(), name='admin-cert-list'),
    path('certificate-requests/<int:pk>/', CertificateRequestView.as_view(), name='cert-request-detail'),


    # ----- SERVICES ----
    path('medical-requests/', MedicalRequestView.as_view(), name='medical-requests'),
    path('medical-requests/<int:pk>/', MedicalRequestView.as_view(), name='medical-request-detail'),


    path('loan-requests/', LoanRequestView.as_view(), name ='loan-requests'),


    path('programs/', ProgramListView.as_view(), name='program-list'),
    path('programs/<int:pk>/register/', RegisterProgramView.as_view(), name='program-register'),

    
    path('food-services/', FoodServiceListCreate.as_view(), name='food-list'),
    path('food-services/<int:pk>/', FoodServiceDetail.as_view(), name='food-detail'),

    path('loan-requests/', LoanRequestView.as_view(), name='loan-list'),
    path('loan-requests/<int:pk>/', LoanRequestView.as_view(), name='loan-detail'),
]