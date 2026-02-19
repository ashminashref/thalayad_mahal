from django.urls import path
from .views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user-profile/', UserProfileView.as_view(), name='user-profile'),

    path('announcements/', AnnouncementListCreateView.as_view(), name='announcements'),
    path('announcements/<int:pk>/', AnnouncementDetailView.as_view(), name='announcement-detail'),

    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDeleteView.as_view(), name='user-delete'),

    path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
    path('teams/<int:pk>/', TeamDetailView.as_view(), name='team-detail'),

    path('books/', BookListCreateView.as_view(), name='book-list-create'),
    path('books/<int:pk>/', BookDetailView.as_view(), name='book-detail'),

    path('my-payments/', MyPaymentListView.as_view(), name='my-payments'),

path('certificate-requests/', CertificateRequestView.as_view(), name='cert-requests'),
path('admin/certificate-requests/', AdminCertificateRequestListView.as_view(), name='admin-cert-list'),
path('certificate-requests/<int:pk>/', CertificateRequestView.as_view(), name='cert-request-detail'),]


