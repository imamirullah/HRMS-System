from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Employee
from .serializers import EmployeeSerializer


class EmployeeListCreate(APIView):

    def get(self, request):
        employees = Employee.objects.all()
        data = [
            {
                "id": str(e.id),
                "employee_id": e.employee_id,
                "full_name": e.full_name,
                "email": e.email,
                "department": e.department,
                "created_at": e.created_at,
            }
            for e in employees
        ]
        return Response({"success": True, "data": data})

    def post(self, request):
        serializer = EmployeeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data

        if Employee.objects(employee_id=data["employee_id"]).count() > 0:
            return Response(
                {"success": False, "message": "Employee ID already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if Employee.objects(email=data["email"]).count() > 0:
            return Response(
                {"success": False, "message": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        employee = Employee(**data)
        employee.save()

        return Response(
            {
                "success": True,
                "data": {
                    "id": str(employee.id),
                    **data,
                    "created_at": employee.created_at,
                },
            },
            status=status.HTTP_201_CREATED
        )


class EmployeeDetail(APIView):

    def put(self, request, pk):
        try:
            employee = Employee.objects.get(id=pk)
        except Employee.DoesNotExist:
            return Response(
                {"success": False, "message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = EmployeeSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {"success": False, "message": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data

        # ✅ employee_id uniqueness (exclude self)
        if Employee.objects(
            employee_id=data["employee_id"],
            id__ne=employee.id
        ).count() > 0:
            return Response(
                {"success": False, "message": "Employee ID already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ email uniqueness (exclude self)
        if Employee.objects(
            email=data["email"],
            id__ne=employee.id
        ).count() > 0:
            return Response(
                {"success": False, "message": "Email already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        employee.employee_id = data["employee_id"]
        employee.full_name = data["full_name"]
        employee.email = data["email"]
        employee.department = data["department"]
        employee.save()

        return Response(
            {
                "success": True,
                "data": {
                    "id": str(employee.id),
                    "employee_id": employee.employee_id,
                    "full_name": employee.full_name,
                    "email": employee.email,
                    "department": employee.department,
                    "created_at": employee.created_at,
                },
            },
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):
        try:
            employee = Employee.objects.get(id=pk)
            employee.delete()
            return Response({"success": True, "data": {}})
        except Employee.DoesNotExist:
            return Response(
                {"success": False, "message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )


class EmployeeRetrieve(APIView):

    def get(self, request, pk):
        try:
            e = Employee.objects.get(id=pk)
        except Employee.DoesNotExist:
            return Response(
                {"success": False, "message": "Employee not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "success": True,
                "data": {
                    "id": str(e.id),
                    "employee_id": e.employee_id,
                    "full_name": e.full_name,
                    "email": e.email,
                    "department": e.department,
                    "created_at": e.created_at,
                },
            }
        )
