from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from django.utils.timezone import now

from employees.models import Employee
from .models import Attendance


class AttendanceView(APIView):
    """
    POST  -> Mark attendance
    GET   -> HR: View attendance by date
    """

    def post(self, request):
        employee_id = request.data.get("employee_id")
        date_str = request.data.get("date")
        status_value = request.data.get("status", "Present")

        # ---------------- Validation ----------------
        if not employee_id or not date_str:
            return Response(
                {
                    "success": False,
                    "message": "employee_id and date are required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid date format (YYYY-MM-DD)"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ---------------- Employee check ----------------
        employee = Employee.objects(employee_id=employee_id).first()
        if not employee:
            return Response(
                {
                    "success": False,
                    "message": "Employee not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ---------------- Upsert Attendance ----------------
        Attendance.objects(
            employee_id=employee_id,
            date=date
        ).update_one(
            set__status=status_value,
            set__created_at=now(),
            upsert=True
        )

        return Response(
            {
                "success": True,
                "message": "Attendance marked successfully"
            },
            status=status.HTTP_201_CREATED
        )

    def get(self, request):
        """
        HR: View attendance by date
        /api/attendance/?date=YYYY-MM-DD
        """

        date_str = request.GET.get("date")
        if not date_str:
            return Response(
                {
                    "success": False,
                    "message": "date query param is required"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {
                    "success": False,
                    "message": "Invalid date format (YYYY-MM-DD)"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        employees = Employee.objects.all()
        attendance_records = Attendance.objects(
            date=date,
            status="Present"
        )

        present_ids = {att.employee_id for att in attendance_records}

        present = []
        absent = []

        for emp in employees:
            emp_data = {
                "employee_id": emp.employee_id,
                "full_name": emp.full_name
            }

            if emp.employee_id in present_ids:
                present.append(emp_data)
            else:
                absent.append(emp_data)

        return Response(
            {
                "success": True,
                "date": date_str,
                "present": present,
                "absent": absent
            },
            status=status.HTTP_200_OK
        )


class AttendanceByEmployeeView(APIView):
    """
    GET -> Attendance history of a single employee
    /api/attendance/<employee_id>/
    """

    def get(self, request, employee_id):
        employee = Employee.objects(employee_id=employee_id).first()
        if not employee:
            return Response(
                {
                    "success": False,
                    "message": "Employee not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        records = Attendance.objects(
            employee_id=employee_id
        ).order_by("-date")

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
