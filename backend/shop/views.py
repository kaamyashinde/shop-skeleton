import json

from django.db import transaction
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from .models import Order, OrderItem, Product

PRODUCT_FIELDS = ("id", "title", "subtitle", "description", "image", "price_ore")


def products(request):
    """GET /api/products -> {"products": [...]}"""
    return JsonResponse({"products": list(Product.objects.values(*PRODUCT_FIELDS))})



def _lines_from_request(request):
    items = json.loads(request.body).get("items") or []
    if not items:
        raise ValueError("empty")

    products = Product.objects.in_bulk(item["product_id"] for item in items)
    lines = []
    for item in items:
        product = products.get(item["product_id"])
        qty = item["quantity"]
        if product is None or not isinstance(qty, int) or qty < 1:
            raise ValueError("invalid item")
        lines.append((product, qty))
    return lines



def _save_order(lines):
    total = sum(qty * p.price_ore for p, qty in lines)
    with transaction.atomic():
        order = Order.objects.create(total_ore=total)
        OrderItem.objects.bulk_create(
            OrderItem(order=order, product=p, quantity=qty, unit_price_ore=p.price_ore)
            for p, qty in lines
        )
    return order