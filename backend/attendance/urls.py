from django.urls import path
from .views import AttendanceView, AttendanceByEmployeeView, AttendanceSummaryView

urlpatterns = [
    path("", AttendanceView.as_view()),
    path("summary/", AttendanceSummaryView.as_view()),
    path("<str:employee_id>/", AttendanceByEmployeeView.as_view()),
]
