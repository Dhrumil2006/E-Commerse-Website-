import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart-context";

interface CartPanelProps {
  onClose: () => void;
}

export function CartPanel({ onClose }: CartPanelProps) {
  const { items, subtotal, shipping, tax, total, updateQuantity, removeFromCart, itemCount } = useCart();

  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Link href="/products">
            <Button onClick={onClose} data-testid="button-continue-shopping-empty">
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold">
          Shopping Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
        </h2>
      </div>

      {amountToFreeShipping > 0 && (
        <div className="p-4 bg-muted/50">
          <p className="text-sm text-center mb-2">
            Add <span className="font-semibold">${amountToFreeShipping.toFixed(2)}</span> more for free shipping
          </p>
          <Progress value={freeShippingProgress} className="h-2" />
        </div>
      )}

      {amountToFreeShipping <= 0 && (
        <div className="p-4 bg-primary/10 text-primary">
          <p className="text-sm text-center font-medium">
            You've unlocked free shipping!
          </p>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4"
              data-testid={`cart-item-${item.product.id}`}
            >
              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.product.id}`} onClick={onClose}>
                  <h4 className="font-medium truncate hover:underline">
                    {item.product.name}
                  </h4>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {item.product.category}
                </p>
                <p className="font-semibold mt-1">
                  ${item.product.price.toFixed(2)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground"
                  onClick={() => removeFromCart(item.product.id)}
                  data-testid={`button-remove-${item.product.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    data-testid={`button-decrease-${item.product.id}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span
                    className="w-8 text-center text-sm"
                    data-testid={`text-quantity-${item.product.id}`}
                  >
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    data-testid={`button-increase-${item.product.id}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span data-testid="text-shipping">
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span data-testid="text-tax">${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span data-testid="text-total">${total.toFixed(2)}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Link href="/checkout" onClick={onClose}>
            <Button className="w-full" size="lg" data-testid="button-checkout">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/products" onClick={onClose}>
            <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
