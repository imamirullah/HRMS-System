from rest_framework import serializers
from .models import Attendance

from rest_framework import serializers

class AttendanceSerializer(serializers.Serializer):
    id = serializers.CharField(read_only=True)
    employee_id = serializers.CharField()
    employee_name = serializers.CharField()
    date = serializers.DateField()
    status = serializers.CharField()
    created_at = serializers.DateTimeField()

