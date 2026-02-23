from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils import timezone

# --- USER MODEL ---
class User(AbstractUser):
    house_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True)
    is_mahal_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username

# --- ADMIN & ANNOUNCEMENTS ---
class Announcements(models.Model):
    PRIORITY_CHOICES = [('low', 'LOW'), ('medium', 'MEDIUM'), ('high', 'HIGH')]
    STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]

    title = models.CharField(max_length=255)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='low')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.title

# --- TEAMS & MEMBERS ---
class Team(models.Model):
    team_name = models.CharField(max_length=255)
    occasion = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    target_date = models.DateField()
    status = models.CharField(max_length=50, default='Upcoming')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.team_name

class TeamMember(models.Model):
    team = models.ForeignKey(Team, related_name='members', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=100, default='Member')

# --- MERGED PAYMENT MODEL ---
class Payment(models.Model):
    PAYMENT_TYPES = [
        ('MONTHLY', 'Monthly Contribution'),
        ('MADRASSA', 'Madrassa Fee'),
        ('ZAKAT', 'Zakat'),
        ('SADAQAH', 'Sadaqah'),
    ]
    METHODS = [('CARD', 'Card'), ('UPI', 'UPI'), ('BANK', 'Bank Transfer'), ('CASH', 'Cash')]
    STATUS = [('PENDING', 'Pending'), ('VERIFIED', 'Verified'), ('REJECTED', 'Rejected')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=20, choices=METHODS)
    # Proof for UPI/Bank
    screenshot = models.ImageField(upload_to='payments/proofs/', null=True, blank=True)
    status = models.CharField(max_length=15, choices=STATUS, default='PENDING')
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.payment_type} - ₹{self.amount}"


class GlobalFeeConfig(models.Model):
    monthly_contribution = models.DecimalField(max_digits=10, decimal_places=2, default=500.00)
    madrassa_fee = models.DecimalField(max_digits=10, decimal_places=2, default=1200.00)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Global Fee Configuration"

    def __str__(self):
        return "Global Fee Settings"
    


# --- LIBRARY ---
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    quantity = models.IntegerField(default=1)
    in_stock = models.BooleanField(default=True)


class BookRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('IN_HAND', 'In Hand'),
        ('RETURNED', 'Returned'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    request_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"    

# --- CERTIFICATE REQUESTS ---
class CertificateRequest(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    certificate_type = models.CharField(max_length=50)
    full_name = models.CharField(max_length=255)
    event_date = models.DateField()
    address = models.TextField(null=True, blank=True)
    document = models.FileField(upload_to='certificates/proofs/')
    
    # Marriage Specific
    bride_name = models.CharField(max_length=255, null=True, blank=True)
    groom_name = models.CharField(max_length=255, null=True, blank=True)
    bride_guardian = models.CharField(max_length=255, null=True, blank=True)
    groom_guardian = models.CharField(max_length=255, null=True, blank=True)
    
    # Birth/General
    father_name = models.CharField(max_length=255, null=True, blank=True)
    mother_name = models.CharField(max_length=255, null=True, blank=True)
    
    # Education Specific
    institution_name = models.CharField(max_length=255, null=True, blank=True)
    reg_no = models.CharField(max_length=100, null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.certificate_type}"