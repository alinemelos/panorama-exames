from django.contrib import admin
from apps.core.models import Collection, Duty, Exam, Machine, Problem

admin.site.register(Exam)
admin.site.register(Problem)
admin.site.register(Machine)
admin.site.register(Duty)
admin.site.register(Collection)
