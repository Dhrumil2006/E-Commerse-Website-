import { useState } from "react";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { categories, type Category } from "@shared/schema";

interface ProductFiltersProps {
  selectedCategory: Category;
  onCategoryChange: (category: Category) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Best Rated" },
];

const ratingOptions = [
  { value: 0, label: "All Ratings" },
  { value: 4, label: "4 Stars & Up" },
  { value: 3, label: "3 Stars & Up" },
  { value: 2, label: "2 Stars & Up" },
];

function FilterContent({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  minRating,
  onMinRatingChange,
  onClearFilters,
}: Omit<ProductFiltersProps, "sortBy" | "onSortChange">) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">Categories</h4>
        </div>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={selectedCategory === category}
                onCheckedChange={() => onCategoryChange(category)}
                data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, "-")}`}
              />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <Slider
          min={0}
          max={200}
          step={5}
          value={priceRange}
          onValueChange={(value) => onPriceRangeChange(value as [number, number])}
          className="mb-2"
          data-testid="slider-price-range"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="font-medium mb-3">Rating</h4>
        <div className="space-y-2">
          {ratingOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={minRating === option.value}
                onCheckedChange={() => onMinRatingChange(option.value)}
                data-testid={`checkbox-rating-${option.value}`}
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full"
        onClick={onClearFilters}
        data-testid="button-clear-filters"
      >
        <X className="h-4 w-4 mr-2" />
        Clear All Filters
      </Button>
    </div>
  );
}

export function ProductFilters(props: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sortBy, onSortChange } = props;

  return (
    <>
      <div className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            <h3 className="font-semibold">Filters</h3>
          </div>
          <FilterContent {...props} />
        </div>
      </div>

      <div className="lg:hidden flex items-center justify-between gap-4 mb-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" data-testid="button-mobile-filters">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
              </SheetTitle>
            </SheetHeader>
            <FilterContent {...props} />
          </SheetContent>
        </Sheet>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-48" data-testid="select-sort-mobile">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}

export function SortSelect({ sortBy, onSortChange }: { sortBy: string; onSortChange: (sort: string) => void }) {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <Label className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</Label>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48" data-testid="select-sort-desktop">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
