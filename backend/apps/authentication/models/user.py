import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from apps.authentication.managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        NURSING = 'nursing', 'Nursing'
        ADMINISTRATOR = 'administrator', 'Administrator'

    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.NURSING)
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    activation_token = models.UUIDField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email
