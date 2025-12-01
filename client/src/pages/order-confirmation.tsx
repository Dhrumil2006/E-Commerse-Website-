import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { CheckCircle, Package, Truck, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order } from "@shared/schema";

function OrderConfirmationSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>
      <Card className="overflow-visible">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: [`/api/orders/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <OrderConfirmationSkeleton />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen py-12">
        <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const orderItems = JSON.parse(order.items);

  return (
    <div className="min-h-screen py-12 bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-4">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2" data-testid="text-order-success">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. We'll send you an email confirmation shortly.
          </p>
        </div>

        <Card className="mb-6 overflow-visible">
          <CardHeader>
            <CardTitle className="text-lg">Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order Number</span>
              <span className="font-mono font-medium" data-testid="text-order-id">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Order Date</span>
              <span>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Just now"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1 text-primary font-medium capitalize">
                <Package className="h-4 w-4" />
                {order.status}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 overflow-visible">
          <CardHeader>
            <CardTitle className="text-lg">Items Ordered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems.map((item: { productId: string; name: string; price: number; quantity: number }) => (
                <div key={item.productId} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span data-testid="text-order-total">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 overflow-visible">
          <CardHeader>
            <CardTitle className="text-lg">Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-muted-foreground">
              <p className="font-medium text-foreground">{order.customerName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
            </div>

            <div className="mt-4 flex items-start gap-3 p-3 bg-muted rounded-md">
              <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Estimated Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 overflow-visible">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm">
                  Confirmation sent to <span className="font-medium">{order.customerEmail}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <Link href="/products">
            <Button size="lg" data-testid="button-continue-shopping">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Have questions? <a href="mailto:hello@artisanmarket.com" className="text-primary underline">Contact us</a>
          </p>
        </div>
      </div>
    </div>
  );
}
