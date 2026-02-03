from mongoengine import Document, ReferenceField, DateField, StringField, DateTimeField
from django.utils.timezone import now
from employees.models import Employee

class Attendance(Document):
    employee = ReferenceField(Employee, required=True)
    date = DateField(required=True)
    status = StringField(required=True, choices=("Present", "Absent"))
    created_at = DateTimeField(default=now)

    meta = {
        "indexes": [
            {"fields": ("employee", "date"), "unique": True}
        ]
    }
