import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearch } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { ProductFilters, SortSelect } from "@/components/product-filters";
import type { Product, Category } from "@shared/schema";

function ProductsSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {[...Array(9)].map((_, i) => (
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

export default function Products() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialCategory = (params.get("category") as Category) || "All";

  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState("featured");
  const [minRating, setMinRating] = useState(0);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && (priceRange[1] >= 200 || p.price <= priceRange[1])
    );

    if (minRating > 0) {
      filtered = filtered.filter((p) => (p.rating || 0) >= minRating);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.reverse();
        break;
      case "featured":
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, selectedCategory, priceRange, sortBy, minRating]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, 200]);
    setMinRating(0);
    setSortBy("featured");
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-muted-foreground">
            {isLoading
              ? "Loading products..."
              : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "product" : "products"}`}
          </p>
        </div>

        <div className="flex gap-8">
          <ProductFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            onClearFilters={handleClearFilters}
          />

          <div className="flex-1">
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-muted-foreground" data-testid="text-product-count">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
              </p>
              <SortSelect sortBy={sortBy} onSortChange={setSortBy} />
            </div>

            {isLoading ? (
              <ProductsSkeletonGrid />
            ) : filteredProducts.length === 0 ? (
              <Card className="overflow-visible">
                <CardContent className="py-16 text-center">
                  <p className="text-lg text-muted-foreground mb-4">No products found matching your filters.</p>
                  <button
                    onClick={handleClearFilters}
                    className="text-primary underline underline-offset-4 hover:no-underline"
                    data-testid="button-clear-filters-inline"
                  >
                    Clear all filters
                  </button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
