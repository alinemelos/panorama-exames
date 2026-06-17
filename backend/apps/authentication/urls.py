from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('logout/', views.LogoutView.as_view(), name='auth-logout'),
    path('request-access/', views.RequestAccessView.as_view(), name='auth-request-access'),
    path('request-reset/', views.RequestResetView.as_view(), name='auth-request-reset'),

    path('access-requests/', views.AccessRequestListView.as_view(), name='auth-access-requests'),
    path('access-requests/<int:pk>/approve/', views.AccessRequestApproveView.as_view(), name='auth-access-request-approve'),
    path('access-requests/<int:pk>/reject/', views.AccessRequestRejectView.as_view(), name='auth-access-request-reject'),

    path('reset-requests/', views.ResetRequestListView.as_view(), name='auth-reset-requests'),
    path('reset-requests/<int:pk>/approve/', views.ResetRequestApproveView.as_view(), name='auth-reset-request-approve'),
    path('reset-requests/<int:pk>/reject/', views.ResetRequestRejectView.as_view(), name='auth-reset-request-reject'),
]
