from django.urls import path, include

urlpatterns = [
    path("api/employees/", include("employees.urls")),
    path("api/attendance/", include("attendance.urls")),
]
