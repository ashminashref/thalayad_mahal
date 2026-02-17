from rest_framework import serializers
from .models import User, Announcements

class UserSerializer(serializers.ModelSerializer):
    # write_only ensures password isn't sent back in GET requests
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'phone_number', 'house_name', 'is_mahal_admin', 'password']

    def create(self, validated_data):
        # Hash the password before saving
        user = User.objects.create_user(**validated_data)
        return user


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcements
        fields = '__all__'