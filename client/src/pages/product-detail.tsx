import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { ChevronLeft, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ReviewsSection } from "@/components/reviews-section";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product, Review } from "@shared/schema";

function ProductDetailSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <Skeleton className="aspect-square rounded-lg" />
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: [`/api/products/${id}/reviews`],
    enabled: !!id,
  });

  const reviewMutation = useMutation({
    mutationFn: async (review: { name: string; rating: number; comment: string }) => {
      return apiRequest("POST", `/api/products/${id}/reviews`, {
        reviewerName: review.name,
        rating: review.rating,
        comment: review.comment,
        productId: id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}/reviews`] });
      queryClient.invalidateQueries({ queryKey: [`/api/products/${id}`] });
      toast({
        title: "Review submitted",
        description: "Thank you for your review!",
      });
    },
  });

  if (productLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ProductDetailSkeleton />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link href="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <Link href="/products">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
              data-testid="img-product-main"
            />
            {discount > 0 && (
              <Badge
                className="absolute top-4 right-4"
                variant="destructive"
              >
                {discount}% OFF
              </Badge>
            )}
            {product.featured && !discount && (
              <Badge className="absolute top-4 right-4">
                Featured
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-muted-foreground mb-1" data-testid="text-product-category">
                {product.category}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3" data-testid="text-product-name">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold" data-testid="text-product-price">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed" data-testid="text-product-description">
              {product.description}
            </p>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    data-testid="button-decrease-quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium" data-testid="text-quantity">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    data-testid="button-increase-quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
              <Link href="/checkout">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  data-testid="button-buy-now"
                >
                  Buy Now
                </Button>
              </Link>
            </div>

            <Card className="overflow-visible bg-muted/50">
              <CardContent className="p-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Truck className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Free shipping over $50</p>
                </div>
                <div className="text-center">
                  <Shield className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Secure checkout</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">30-day returns</p>
                </div>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Full Description</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    {product.description}
                    {" "}Each piece is handcrafted with care by local artisans using traditional techniques passed down through generations. Made with sustainable materials and eco-friendly practices.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping Information</AccordionTrigger>
                <AccordionContent>
                  <ul className="text-muted-foreground space-y-2">
                    <li>Free standard shipping on orders over $50</li>
                    <li>Standard shipping: 5-7 business days</li>
                    <li>Express shipping available at checkout</li>
                    <li>Ships from Portland, Oregon</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="returns">
                <AccordionTrigger>Returns & Exchanges</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    We offer a 30-day return policy for all unused items in their original packaging. Please contact us at hello@artisanmarket.com to initiate a return. Custom or personalized items are final sale.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <Separator className="my-12" />

        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-8">Customer Reviews</h2>
          <ReviewsSection
            reviews={reviews}
            averageRating={product.rating || 0}
            totalReviews={product.reviewCount || 0}
            onSubmitReview={(review) => reviewMutation.mutate(review)}
          />
        </section>
      </div>
    </div>
  );
}
