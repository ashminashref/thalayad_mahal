# Server/mahalproject/myapp/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from .models import CertificateRequest

# SIGNAL 1: Handles the basic status change notification
@receiver(post_save, sender=CertificateRequest)
def send_status_email(sender, instance, created, **kwargs):
    # Only trigger on Admin update, not on user creation
    if not created:
        # Check for APPROVED status specifically
        if instance.status == 'APPROVED':
            subject = f"Mahal Connect: {instance.certificate_type} Approved"
            message = (
                f"Assalamu Alaikum {instance.full_name},\n\n"
                f"Your certificate request has been APPROVED. "
                f"You can collect it from the Mahal office."
            )
            send_mail(subject, message, 'noreply@mahalconnect.com', [instance.user.email])

        # Check for REJECTED status specifically
        elif instance.status == 'REJECTED':
            subject = f"Mahal Connect: {instance.certificate_type} Rejected"
            message = (
                f"Assalamu Alaikum {instance.full_name},\n\n"
                f"Your certificate request has been REJECTED. "
                f"Please contact the office for more details."
            )
            send_mail(subject, message, 'noreply@mahalconnect.com', [instance.user.email])

# SIGNAL 2: Handles the detailed "Mahal Connect" official notification
# @receiver(post_save, sender=CertificateRequest)
# def notify_status_change(sender, instance, created, **kwargs):
#     if not created:
#         # We wrap this in a check to ensure it NEVER sends "PENDING"
#         if instance.status in ['APPROVED', 'REJECTED']:
#             subject = f"Mahal Connect: Official Update for {instance.certificate_type}"
            
#             # We explicitly use the instance status to ensure accuracy
#             message = (
#                 f"Assalamu Alaikum {instance.full_name},\n\n"
#                 f"Your request has been officially processed as: {instance.status}.\n"
#             )
            
#             if instance.status == 'APPROVED':
#                 message += "You can now download the official copy from the dashboard."
                
#             send_mail(subject, message, 'admin@mahal.com', [instance.user.email])