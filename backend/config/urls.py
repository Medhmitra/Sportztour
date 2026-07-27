from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from apps.users.views import CustomTokenObtainPairView, UserRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/users/register/', UserRegisterView.as_view(), name='user_register'),
]
