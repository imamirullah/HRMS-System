from mongoengine import Document, StringField, EmailField, DateTimeField
from datetime import datetime

class Employee(Document):
    employee_id = StringField(required=True, unique=True)
    full_name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    department = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)

    meta = {
        "collection": "employees"
    }
