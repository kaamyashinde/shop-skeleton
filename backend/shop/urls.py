from django.urls import path

from . import views

urlpatterns = [
    path("products", views.products),
    path("orders", views.create_order),
]

# Add any other URL you need here.
