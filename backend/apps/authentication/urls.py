from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('request-access/', views.RequestAccessView.as_view(), name='auth-request-access'),
    path('set-password/', views.SetPasswordView.as_view(), name='auth-set-password'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='auth-reset-password'),
    path('request-reset/', views.RequestResetView.as_view(), name='auth-request-reset'),
]
