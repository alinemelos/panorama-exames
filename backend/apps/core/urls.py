from django.urls import path
from . import views

urlpatterns = [
    path('exams/', views.ExamListCreateView.as_view(), name='exam-list'),
    path('exams/<int:pk>/', views.ExamDetailView.as_view(), name='exam-detail'),
    path('machines/', views.MachineListCreateView.as_view(), name='machine-list'),
    path('machines/<int:pk>/', views.MachineDetailView.as_view(), name='machine-detail'),
    path('problems/', views.ProblemListCreateView.as_view(), name='problem-list'),
    path('problems/<int:pk>/', views.ProblemDetailView.as_view(), name='problem-detail'),
    path('duties/', views.DutyCreateView.as_view(), name='duty-create'),
    path('duties/current/', views.DutyCurrentView.as_view(), name='duty-current'),
    path('duties/<int:pk>/collections/', views.DutyAddCollectionView.as_view(), name='duty-add-collection'),
    path('duties/<int:pk>/close/', views.DutyCloseView.as_view(), name='duty-close'),
    path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
]
