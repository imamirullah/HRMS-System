from django.http import JsonResponse
from django.urls import path, include

def health(request):
    return JsonResponse({"status": "HRMS Lite API Running"})

urlpatterns = [
    path("", health),  # 👈 add this
    path("api/employees/", include("employees.urls")),
    path("api/attendance/", include("attendance.urls")),
]
