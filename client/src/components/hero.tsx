import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@assets/stock_images/local_artisan_market_6b68bd39.jpg";

export function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      
      <div className="relative h-full max-w-7xl mx-auto px-4 md:px-6 flex flex-col justify-center">
        <div className="max-w-xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Handcrafted with Love, Made for You
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Discover unique, locally-made artisan products. From handmade pottery to organic goods, 
            each piece tells a story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/products">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base"
                data-testid="button-shop-now"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products?featured=true">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base bg-white/10 backdrop-blur-sm border-white/30 text-white"
                data-testid="button-featured"
              >
                View Featured
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-white/70">
            Supporting local artisans since 2018
          </p>
        </div>
      </div>
    </section>
  );
}
