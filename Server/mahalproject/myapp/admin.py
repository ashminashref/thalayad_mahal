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