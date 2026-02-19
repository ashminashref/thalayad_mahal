# Server/mahalproject/myapp/apps.py

from django.apps import AppConfig

class MyappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'myapp'

    def ready(self):
        # This line is mandatory to make signals work!
        import myapp.signals