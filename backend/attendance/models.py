from mongoengine import Document, StringField, DateField, DateTimeField
from django.utils.timezone import now

class Attendance(Document):
    employee_id = StringField(required=True, null=False)
    date = DateField(required=True)
    status = StringField(choices=["Present", "Absent"], default="Present")
    created_at = DateTimeField(default=now)

    meta = {
        "collection": "attendance",
        "indexes": [
            {
                "fields": ["employee_id", "date"],
                "unique": True,
                "sparse": True  # 🔥 prevents NULL duplicate issue forever
            }
        ]
    }
