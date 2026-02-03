from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from employees.models import Employee
from .models import Attendance
from .serializers import AttendanceSerializer
from datetime import datetime
from django.utils.timezone import now


class AttendanceCreateView(APIView):
    def post(self, request):
        employee_id = request.data.get("employee_id")
        date_str = request.data.get("date")
        status_value = request.data.get("status")

        if not employee_id or not date_str or not status_value:
            return Response(
                {"success": False, "message": "All fields are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                {"success": False, "message": "Invalid date format"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {"success": False, "message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # MongoEngine duplicate check
        if Attendance.objects(employee=employee, date=date).count() > 0:
            return Response(
                {"success": False, "message": "Attendance already marked"},
                status=status.HTTP_400_BAD_REQUEST
            )

        attendance = Attendance(
            employee=employee,
            date=date,
            status=status_value
        )
        attendance.save()

        data = {
            "id": str(attendance.id),
            "employee_id": employee.employee_id,
            "employee_name": employee.full_name,
            "date": attendance.date,
            "status": attendance.status,
            "created_at": attendance.created_at,
        }

        serializer = AttendanceSerializer(data)
        return Response(
            {"success": True, "data": serializer.data},
            status=status.HTTP_201_CREATED
        )


class AttendanceByEmployeeView(APIView):
    def get(self, request, employee_id):
        try:
            employee = Employee.objects.get(employee_id=employee_id)
        except Employee.DoesNotExist:
            return Response(
                {"success": False, "message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        records = Attendance.objects(employee=employee)
        data = [
            {
                "id": str(a.id),
                "employee_id": employee.employee_id,
                "employee_name": employee.full_name,
                "date": a.date,
                "status": a.status,
                "created_at": a.created_at,
            }
            for a in records
        ]

        return Response({"success": True, "data": data})


class AttendanceSummaryView(APIView):
    def get(self, request):
        today = now().date()

        total = Employee.objects.count()
        present = Attendance.objects(date=today, status="Present").count()
        absent = max(total - present, 0)

        return Response({
            "success": True,
            "data": {
                "total_employees": total,
                "present": present,
                "absent": absent
            }
        })
