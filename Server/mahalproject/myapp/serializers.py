from rest_framework import serializers
from .models import User, Announcements, Team, TeamMember, Book, CertificateRequest

class UserSerializer(serializers.ModelSerializer):
    # write_only ensures password isn't sent back in GET requests
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only' : True}}
    def create(self, validated_data):
        # Hash the password before saving
        user = User.objects.create_user(**validated_data)
        return user


class AnnouncementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Announcements
        fields = '__all__'



# myapp/serializers.py
from rest_framework import serializers
from .models import Team, TeamMember

# myapp/serializers.py
from rest_framework import serializers
from .models import Team, TeamMember

# myapp/serializers.py

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['name', 'role']

class TeamSerializer(serializers.ModelSerializer):
    # 1. Nest the members so you can see names and roles
    members = TeamMemberSerializer(many=True, read_only=True)
    
    # 2. Add a MethodField to calculate the count dynamically
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = Team
        # 3. Add 'members_count' to the fields list so React can see it
        fields = [
            'id', 'team_name', 'occasion', 'description', 
            'target_date', 'status', 'members', 'members_count'
        ]

    # 4. This function provides the value for 'members_count'
    def get_members_count(self, obj):
        return obj.members.count()

    def create(self, validated_data):
        # Handle manual member creation if sent via POST
        members_data = self.context.get('request').data.get('members', [])
        team = Team.objects.create(**validated_data)
        for member_data in members_data:
            TeamMember.objects.create(team=team, **member_data)
        return team

    def update(self, instance, validated_data):
        members_data = self.context.get('request').data.get('members', None)
        
        # Update Team fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update members if provided
        if members_data is not None:
            instance.members.all().delete()
            for m_data in members_data:
                TeamMember.objects.create(team=instance, **m_data)
        return instance
# book
# serializers.py
class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'category', 'description', 'quantity', 'in_stock']


# payment
from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'month', 'status', 'method', 'submitted_at']



# certificate
# Server/mahalproject/myapp/serializers.py

# Server/mahalproject/myapp/serializers.py
from rest_framework import serializers
from .models import CertificateRequest

# Server/mahalproject/myapp/serializers.py
from rest_framework import serializers
from .models import CertificateRequest

class CertificateRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = CertificateRequest
        fields = [
            'id', 'certificate_type', 'full_name', 'event_date', 
            'bride_name', 'groom_name', 'bride_guardian', 'groom_guardian',
            'father_name', 'mother_name', 'address', 'document', 
            'institution_name', 'reg_no', 'status', 'username', 'created_at'
        ]
        # REMOVE 'status' from this list
        read_only_fields = ['id', 'username', 'created_at']