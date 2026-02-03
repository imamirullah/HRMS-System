from rest_framework import serializers

class EmployeeSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField()
    full_name = serializers.CharField()
    email = serializers.EmailField()
    department = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)
