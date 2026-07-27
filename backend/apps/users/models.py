from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        USER = 'USER', 'User'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.USER
    )
    organization = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="Name of organization (for multi-tenant support)"
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
