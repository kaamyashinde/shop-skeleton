from django.db import models


class Product(models.Model):
    """Seeded from products.json. Money is stored as integer øre (3090 == 30,90 kr).

    `id` is the id straight from products.json, so re-seeding updates rows
    instead of duplicating them.
    """

    id = models.CharField(primary_key=True, max_length=64)
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500)
    price_ore = models.PositiveIntegerField()

    def __str__(self):
        return self.title


class Order(models.Model):
    """One completed purchase. `total_ore` is stored so you can inspect it
    without summing items, and so it stays correct if product prices change.
    """

    created_at = models.DateTimeField(auto_now_add=True)
    total_ore = models.PositiveIntegerField()

    def __str__(self):
        return f"Order {self.id}"


class OrderItem(models.Model):
    """A product line on an order. `unit_price_ore` is a snapshot of the
    product price at purchase time.
    """

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price_ore = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantity}× {self.product_id}"