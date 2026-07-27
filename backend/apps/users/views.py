from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from apps.users.models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_or_email = attrs.get('username')
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                attrs['username'] = user_obj.username
            except User.DoesNotExist:
                pass

        data = super().validate(attrs)
        # Custom claims and user payload mapping
        data['user'] = {
            'email': self.user.email,
            'name': f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username,
            'role': 'admin' if self.user.role == User.Role.ADMIN else 'user'
        }
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name', '')
        role = request.data.get('role', 'user') # 'admin' or 'user'
        organization = request.data.get('organization', '')

        if not email or not password:
            return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Simple username derivation from email
        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}_{counter}"
            counter += 1

        if User.objects.filter(email=email).exists():
            return Response({'error': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        parts = name.split(' ', 1)
        first_name = parts[0]
        last_name = parts[1] if len(parts) > 1 else ''

        db_role = User.Role.ADMIN if role == 'admin' else User.Role.USER

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            role=db_role,
            organization=organization
        )

        return Response({
            'success': True,
            'user': {
                'email': user.email,
                'name': f"{user.first_name} {user.last_name}".strip() or user.username,
                'role': 'admin' if user.role == User.Role.ADMIN else 'user'
            }
        }, status=status.HTTP_201_CREATED)
