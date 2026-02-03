from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.utils.timezone import now

from employees.models import Employee
from .models import Attendance


class AttendanceCreateView(APIView):
    """
    POST -> Mark attendance
    """

    def post(self, request):
        employee_id = request.data.get("employee_id")
        date_str = request.data.get("date")
        status_value = request.data.get("status", "Present")

        # -------- Basic validation --------
        if not employee_id or not date_str:
            return Response(
                {"success": False, "message": "employee_id and date are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if status_value not in ["Present", "Absent"]:
            return Response(
                {"success": False, "message": "Status must be Present or Absent"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"success": False, "message": "Date format must be YYYY-MM-DD"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------- Employee check --------
        employee = Employee.objects(employee_id=employee_id).first()
        if not employee:
            return Response(
                {"success": False, "message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # -------- Duplicate attendance check --------
        if Attendance.objects(employee=employee, date=date).first():
            return Response(
                {
                    "success": False,
                    "message": "Is employee ki aaj attendance already ho chuki hai"
                },
                status=status.HTTP_200_OK
            )

        # -------- Save attendance --------
        Attendance(
            employee=employee,
            date=date,
            status=status_value,
            created_at=now()
        ).save()

        return Response(
            {"success": True, "message": "Attendance marked successfully"},
            status=status.HTTP_201_CREATED
        )


class AttendanceByEmployeeView(APIView):
    """
    GET -> Attendance history of an employee
    """

    def get(self, request, employee_id):
        employee = Employee.objects(employee_id=employee_id).first()
        if not employee:
            return Response(
                {"success": False, "message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        records = Attendance.objects(employee=employee).order_by("-date")

        data = [
            {
                "date": str(a.date),
                "status": a.status,
                "created_at": a.created_at,
            }
            for a in records
        ]

        return Response(
            {
                "success": True,
                "employee": {
                    "employee_id": employee.employee_id,
                    "full_name": employee.full_name
                },
                "data": data
            },
            status=status.HTTP_200_OK
        )


class AttendanceSummaryView(APIView):
    """
    GET -> Today's attendance summary
    """

    def get(self, request):
        today = now().date()

        total = Employee.objects.count()
        present = Attendance.objects(
            date=today,
            status="Present"
        ).count()

        absent = max(total - present, 0)

        return Response(
            {
                "success": True,
                "data": {
                    "date": str(today),
                    "total_employees": total,
                    "present": present,
                    "absent": absent
                }
            },
            status=status.HTTP_200_OK
        )
class AttendanceByDateView(APIView):
    """
    GET -> Attendance by date
    /api/attendance/by-date/?date=YYYY-MM-DD
    """

    def get(self, request):
        date_str = request.GET.get("date")

        if not date_str:
            return Response(
                {"success": False, "message": "date query param is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"success": False, "message": "Invalid date format (YYYY-MM-DD)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        records = Attendance.objects(date=date)

        data = [
            {
                "employee_id": a.employee.employee_id,
                "full_name": a.employee.full_name,
                "status": a.status
            }
            for a in records
        ]

        return Response(
            {
                "success": True,
                "date": date_str,
                "data": data
            },
            status=status.HTTP_200_OK
        )
