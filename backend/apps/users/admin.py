from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'organization')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'organization')}),
    )
    list_display = ('username', 'email', 'role', 'organization', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active')
