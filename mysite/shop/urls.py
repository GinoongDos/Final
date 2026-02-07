from django.urls import path
from . import views

app_name = 'shop'

urlpatterns = [
    path('customers/', views.customer_list, name='customers'),
    path('customers/add/', views.customer_create, name='customer_add'),
    path('customers/<int:pk>/edit/', views.customer_update, name='customer_edit'),
    path('customers/<int:pk>/delete/', views.customer_delete, name='customer_delete'),

    path('products/', views.product_list, name='products'),
    path('products/add/', views.product_create, name='product_add'),
    path('products/<int:pk>/edit/', views.product_update, name='product_edit'),
    path('products/<int:pk>/delete/', views.product_delete, name='product_delete'),

    path('orders/', views.order_list, name='order_list'),
    path('orders/create/<int:customer_id>/', views.order_create, name='order_create'),
    path('orders/<int:order_id>/', views.order_detail, name='order_detail'),
    path('orders/<int:order_id>/delete/', views.order_delete, name='order_delete'),
    path('orders/<int:order_id>/items/<int:item_id>/delete/', views.order_item_delete, name='order_item_delete'),
]
