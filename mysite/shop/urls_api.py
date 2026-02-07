from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views_api

router = DefaultRouter()
router.register(r'customers', views_api.CustomerViewSet, basename='customer')
router.register(r'products', views_api.ProductViewSet, basename='product')
router.register(r'orders', views_api.OrderViewSet, basename='order')
router.register(r'order-items', views_api.OrderItemViewSet, basename='orderitem')

urlpatterns = [
    path('', include(router.urls)),
]
