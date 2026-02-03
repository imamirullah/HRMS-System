from django.urls import path
from .views import EmployeeListCreate, EmployeeDetail, EmployeeRetrieve

urlpatterns = [
    path("", EmployeeListCreate.as_view()),
    path("<str:pk>/", EmployeeDetail.as_view()),      # PUT, DELETE
    path("<str:pk>/detail/", EmployeeRetrieve.as_view()),  # GET single
]
