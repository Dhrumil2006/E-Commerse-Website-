import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Truck, Shield, RefreshCw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@shared/schema";

import potteryImg from "@assets/stock_images/artisan_handmade_pot_6efd5cf3.jpg";
import kitchenImg from "@assets/stock_images/wooden_kitchen_cutti_114f635f.jpg";
import homeDecorImg from "@assets/stock_images/handwoven_textile_ba_741aadc7.jpg";
import bathBodyImg from "@assets/stock_images/artisan_soap_handmad_037d58ff.jpg";

const categoryImages: Record<string, string> = {
  Pottery: potteryImg,
  Kitchen: kitchenImg,
  "Home Decor": homeDecorImg,
  "Bath & Body": bathBodyImg,
};

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Checkout",
    description: "100% secure payment",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: Heart,
    title: "Local Artisans",
    description: "Supporting small businesses",
  },
];

function CategoryCard({ name, image }: { name: string; image: string }) {
  return (
    <Link href={`/products?category=${encodeURIComponent(name)}`}>
      <Card className="group overflow-visible hover-elevate cursor-pointer" data-testid={`card-category-${name.toLowerCase().replace(/\s+/g, "-")}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-md">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white font-semibold text-lg">{name}</h3>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function ProductsSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-visible">
          <Skeleton className="aspect-square w-full rounded-t-md" />
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function Home() {
  const { data: featuredProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products?featured=true"],
  });

  return (
    <div className="min-h-screen">
      <Hero />

      <section className="py-12 md:py-16 bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Explore our curated collections</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Object.entries(categoryImages).map(([name, image]) => (
              <CategoryCard key={name} name={name} image={image} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">Handpicked favorites from our collection</p>
            </div>
            <Link href="/products?featured=true">
              <Button variant="outline" className="hidden md:flex" data-testid="button-view-all-featured">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <ProductsSkeletonGrid />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link href="/products?featured=true">
              <Button variant="outline" data-testid="button-view-all-featured-mobile">
                View All Featured
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <Card className="overflow-hidden bg-primary text-primary-foreground">
            <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h2 className="font-serif text-2xl md:text-3xl font-bold mb-3">
                  Join Our Community
                </h2>
                <p className="text-primary-foreground/90 mb-6 max-w-md">
                  Subscribe to get exclusive offers, early access to new products, and updates from our artisans.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto md:mx-0">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    data-testid="input-hero-newsletter"
                  />
                  <Button
                    variant="secondary"
                    className="bg-white text-primary"
                    data-testid="button-hero-subscribe"
                  >
                    Subscribe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
