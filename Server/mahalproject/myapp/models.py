from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework.fields import DateField

class User(AbstractUser):
    house_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True)
    is_mahal_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.username
    

# admin
class Announcements(models.Model):
    PRIORITY_CHOICES = [('low', 'LOW'), ('medium', 'MEDIUM'), ('high', 'HIGH')]
    STATUS_CHOICES = [('draft', 'Draft'), ('published', 'Published')]

    title = models.CharField(max_length=255)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='low')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateField(auto_now=True)

    def __clstr__(self):
        return self.title