from django.urls import path
from .views import (
    AttendanceCreateView,
    AttendanceByEmployeeView,
    AttendanceSummaryView,
    AttendanceByDateView
)

urlpatterns = [
    path("", AttendanceCreateView.as_view()),
    path("by-date/", AttendanceByDateView.as_view()),  # 👈 ADD THIS
    path("summary/", AttendanceSummaryView.as_view()),
    path("<str:employee_id>/", AttendanceByEmployeeView.as_view()),
]
