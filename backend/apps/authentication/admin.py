from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from apps.authentication.models.user import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'name', 'role', 'is_active', 'is_staff', 'password_reset_requested', 'created_at')
    list_filter = ('role', 'is_active', 'is_staff', 'password_reset_requested')
    search_fields = ('email', 'name')
    ordering = ('-created_at',)
    filter_horizontal = ()
    fieldsets = (
        (None, {'fields': ('email',)}),
        ('Informações pessoais', {'fields': ('name', 'role')}),
        ('Permissões', {'fields': ('is_active', 'is_staff')}),
        ('Redefinição de senha', {'fields': ('password_reset_requested',)}),
        ('Datas', {'fields': ('created_at',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'role', 'password1', 'password2'),
        }),
    )
    readonly_fields = ('created_at',)
