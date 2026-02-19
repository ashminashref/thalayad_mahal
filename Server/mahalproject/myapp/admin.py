from django.contrib import admin

# Register your models here.
from django.contrib.auth.admin import UserAdmin
from .models import User, Announcements

# This tells Django to show your custom User model in the dashboard
class CustomUserAdmin(UserAdmin):
    # Add your custom fields to the admin display
    model = User
    list_display = ['username', 'email', 'phone_number', 'house_name', 'is_mahal_admin', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('Mahal Info', {'fields': ('phone_number', 'house_name', 'is_mahal_admin')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(Announcements)


# Server/mahalproject/myapp/admin.py
from django.contrib import admin
from .models import CertificateRequest

@admin.register(CertificateRequest)
class CertificateRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'certificate_type', 'status', 'created_at')
    list_filter = ('status', 'certificate_type')
    search_fields = ('full_name', 'user__username')
    readonly_fields = ('created_at',)
    
    # Optional: logic to restrict editing if you want
    fields = ('user', 'certificate_type', 'full_name', 'event_date', 'document', 'status')