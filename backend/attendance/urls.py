from django.urls import path
from .views import (
    AttendanceCreateView,
    AttendanceByEmployeeView,
    AttendanceSummaryView
)

urlpatterns = [
    path("", AttendanceCreateView.as_view()),
    path("summary/", AttendanceSummaryView.as_view()),
    path("<str:employee_id>/", AttendanceByEmployeeView.as_view()),
]
