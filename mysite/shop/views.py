from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_POST
from .models import Customer, Product, Order, OrderItem
from .forms import CustomerForm, ProductForm, OrderItemForm

# ---------------- CUSTOMERS ----------------
def customer_list(request):
    customers = Customer.objects.all()
    return render(request, 'customer.html', {'customers': customers})

def customer_create(request):
    form = CustomerForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('shop:customers')
    return render(request, 'form.html', {'form': form, 'title': 'Add customer', 'cancel_url': 'shop:customers'})

def customer_update(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    form = CustomerForm(request.POST or None, instance=customer)
    if form.is_valid():
        form.save()
        return redirect('shop:customers')
    return render(request, 'form.html', {'form': form, 'title': 'Edit customer', 'cancel_url': 'shop:customers'})

def customer_delete(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    if request.method == 'POST':
        customer.delete()
        return redirect('shop:customers')
    return render(request, 'confirm_delete.html', {'object': customer, 'back_url': 'shop:customers'})


# ---------------- PRODUCTS ----------------
def product_list(request):
    products = Product.objects.all()
    return render(request, 'product.html', {'products': products})

def product_create(request):
    form = ProductForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('shop:products')
    return render(request, 'form.html', {'form': form, 'title': 'Add product', 'cancel_url': 'shop:products'})

def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk)
    form = ProductForm(request.POST or None, instance=product)
    if form.is_valid():
        form.save()
        return redirect('shop:products')
    return render(request, 'form.html', {'form': form, 'title': 'Edit product', 'cancel_url': 'shop:products'})

def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        product.delete()
        return redirect('shop:products')
    return render(request, 'confirm_delete.html', {'object': product, 'back_url': 'shop:products'})


# ---------------- ORDERS ----------------
def order_list(request):
    orders = Order.objects.all().select_related('customer').order_by('-order_date')
    return render(request, 'order_list.html', {'orders': orders})

def order_create(request, customer_id):
    customer = get_object_or_404(Customer, pk=customer_id)
    order = Order.objects.create(customer=customer)
    return redirect('shop:order_detail', order_id=order.id)

def order_detail(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    items = order.orderitem_set.select_related('product').all()
    form = OrderItemForm(request.POST or None)
    if form.is_valid():
        item = form.save(commit=False)
        item.order = order
        item.save()
        return redirect('shop:order_detail', order_id=order_id)
    return render(request, 'order.html', {
        'order': order,
        'items': items,
        'form': form,
    })

@require_POST
def order_item_delete(request, order_id, item_id):
    order = get_object_or_404(Order, pk=order_id)
    item = get_object_or_404(OrderItem, pk=item_id, order=order)
    item.delete()
    return redirect('shop:order_detail', order_id=order_id)

def order_delete(request, order_id):
    order = get_object_or_404(Order, pk=order_id)
    if request.method == 'POST':
        order.delete()
        return redirect('shop:order_list')
    return render(request, 'confirm_delete.html', {
        'object': order,
        'back_url': 'shop:order_list',
        'back_label': 'Order list',
    })
