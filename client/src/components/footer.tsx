import { Link } from "wouter";
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold">Artisan Market</h3>
            <p className="text-sm text-muted-foreground">
              Curating handcrafted goods from local artisans since 2018. Every purchase supports small businesses and traditional craftsmanship.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" data-testid="button-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Shop</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/products" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-all-products">
                All Products
              </Link>
              <Link href="/products?category=Pottery" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pottery">
                Pottery
              </Link>
              <Link href="/products?category=Kitchen" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-kitchen">
                Kitchen
              </Link>
              <Link href="/products?category=Home%20Decor" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-home-decor">
                Home Decor
              </Link>
              <Link href="/products?category=Bath%20%26%20Body" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-bath-body">
                Bath & Body
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Support</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">
                Contact Us
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-faq">
                FAQ
              </Link>
              <Link href="/shipping" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-shipping">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-returns">
                Returns & Exchanges
              </Link>
            </nav>
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>123 Main Street, Portland, OR 97201</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>(503) 555-0123</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>hello@artisanmarket.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Newsletter</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get special offers, free giveaways, and new arrivals.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button type="submit" data-testid="button-subscribe">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            2024 Artisan Market. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors" data-testid="link-terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
