import { Link } from "wouter";
import { ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <Card
        className="group overflow-visible hover-elevate cursor-pointer h-full"
        data-testid={`card-product-${product.id}`}
      >
        <div className="relative aspect-square overflow-hidden rounded-t-md">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge
              className="absolute top-2 right-2"
              variant="destructive"
              data-testid={`badge-sale-${product.id}`}
            >
              {discount}% OFF
            </Badge>
          )}
          {product.featured && !discount && (
            <Badge
              className="absolute top-2 right-2"
              data-testid={`badge-featured-${product.id}`}
            >
              Featured
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
          <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full"
              onClick={handleAddToCart}
              data-testid={`button-quick-add-${product.id}`}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 rounded-full"
              data-testid={`button-quick-view-${product.id}`}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground" data-testid={`text-category-${product.id}`}>
              {product.category}
            </p>
            <h3
              className="font-medium text-lg leading-tight line-clamp-2"
              data-testid={`text-name-${product.id}`}
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold"
                data-testid={`text-price-${product.id}`}
              >
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
          <Button
            className="w-full mt-4 md:hidden"
            onClick={handleAddToCart}
            data-testid={`button-add-mobile-${product.id}`}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
