from mongoengine import (
    Document, ReferenceField, DateField,
    StringField, DateTimeField, CASCADE
)
from datetime import datetime
from employees.models import Employee

class Attendance(Document):
    employee = ReferenceField(Employee, reverse_delete_rule=CASCADE)
    date = DateField(required=True)
    status = StringField(required=True, choices=("Present", "Absent"))
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "attendance",
        "indexes": [
            {"fields": ("employee", "date"), "unique": True}
        ]
    }
