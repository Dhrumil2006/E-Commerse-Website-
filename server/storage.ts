import { type Product, type InsertProduct, type Review, type InsertReview, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  
  getReviews(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
}

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Rustic Ceramic Bowl Set",
    description: "Handcrafted ceramic bowls with a beautiful rustic glaze. Perfect for serving or decoration. Each piece is unique and made with care by local artisans.",
    price: 45.00,
    originalPrice: 55.00,
    image: "/attached_assets/stock_images/artisan_handmade_pot_6efd5cf3.jpg",
    category: "Pottery",
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
    featured: true,
  },
  {
    id: "prod-2",
    name: "Artisan Stoneware Vase",
    description: "Elegant stoneware vase with organic textures and earth-toned finish. Ideal for fresh or dried flower arrangements.",
    price: 68.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/artisan_handmade_pot_b3f3b117.jpg",
    category: "Pottery",
    rating: 4.9,
    reviewCount: 18,
    inStock: true,
    featured: true,
  },
  {
    id: "prod-3",
    name: "Hand-Thrown Coffee Mug",
    description: "Perfectly weighted coffee mug crafted on a potter's wheel. Features a comfortable handle and durable glaze.",
    price: 28.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/artisan_handmade_pot_0910b0ff.jpg",
    category: "Pottery",
    rating: 4.7,
    reviewCount: 42,
    inStock: true,
    featured: false,
  },
  {
    id: "prod-4",
    name: "Raw Organic Wildflower Honey",
    description: "Pure, unfiltered honey harvested from local wildflowers. Rich in antioxidants and natural enzymes. 16oz jar.",
    price: 18.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/organic_natural_hone_c152ba8d.jpg",
    category: "Kitchen",
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    featured: true,
  },
  {
    id: "prod-5",
    name: "Honey Gift Set with Dipper",
    description: "Three varieties of local honey paired with a handcrafted wooden dipper. Perfect gift for honey lovers.",
    price: 42.00,
    originalPrice: 50.00,
    image: "/attached_assets/stock_images/organic_natural_hone_a84aab20.jpg",
    category: "Kitchen",
    rating: 4.8,
    reviewCount: 31,
    inStock: true,
    featured: false,
  },
  {
    id: "prod-6",
    name: "Lavender Soy Candle",
    description: "Hand-poured soy candle infused with pure lavender essential oil. 8oz with 45+ hours of burn time.",
    price: 24.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/handmade_scented_can_2d95ef42.jpg",
    category: "Candles",
    rating: 4.6,
    reviewCount: 53,
    inStock: true,
    featured: true,
  },
  {
    id: "prod-7",
    name: "Cedar & Pine Candle Set",
    description: "Three-candle set featuring woodsy scents of cedar, pine, and eucalyptus. Perfect for creating a cozy atmosphere.",
    price: 56.00,
    originalPrice: 65.00,
    image: "/attached_assets/stock_images/handmade_scented_can_0d9955dd.jpg",
    category: "Candles",
    rating: 4.7,
    reviewCount: 28,
    inStock: true,
    featured: false,
  },
  {
    id: "prod-8",
    name: "Artisan Soap Collection",
    description: "Set of 4 handmade soaps with natural ingredients: lavender, honey oat, charcoal, and rose. Each bar is 4oz.",
    price: 32.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/artisan_soap_handmad_037d58ff.jpg",
    category: "Bath & Body",
    rating: 4.8,
    reviewCount: 89,
    inStock: true,
    featured: true,
  },
  {
    id: "prod-9",
    name: "Goat Milk Soap Bar",
    description: "Creamy goat milk soap enriched with shea butter and oatmeal. Gentle enough for sensitive skin.",
    price: 12.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/artisan_soap_handmad_ab8e35d2.jpg",
    category: "Bath & Body",
    rating: 4.9,
    reviewCount: 45,
    inStock: true,
    featured: false,
  },
  {
    id: "prod-10",
    name: "Walnut Cutting Board",
    description: "Solid walnut cutting board with juice groove. Hand-sanded and finished with food-safe mineral oil. 14x10 inches.",
    price: 75.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/wooden_kitchen_cutti_114f635f.jpg",
    category: "Kitchen",
    rating: 4.9,
    reviewCount: 36,
    inStock: true,
    featured: true,
  },
  {
    id: "prod-11",
    name: "Maple Serving Board",
    description: "Beautiful maple serving board with live edge detail. Perfect for charcuterie or bread. 18x8 inches.",
    price: 58.00,
    originalPrice: 68.00,
    image: "/attached_assets/stock_images/wooden_kitchen_cutti_bb8801f1.jpg",
    category: "Kitchen",
    rating: 4.7,
    reviewCount: 22,
    inStock: true,
    featured: false,
  },
  {
    id: "prod-12",
    name: "Woven Storage Basket",
    description: "Hand-woven seagrass basket with cotton handles. Great for blankets, toys, or plants. 15x12 inches.",
    price: 38.00,
    originalPrice: null,
    image: "/attached_assets/stock_images/handwoven_textile_ba_741aadc7.jpg",
    category: "Home Decor",
    rating: 4.6,
    reviewCount: 54,
    inStock: true,
    featured: true,
  },
  {
    id: "prod-13",
    name: "Macrame Wall Basket Set",
    description: "Set of 3 woven wall baskets in varying sizes. Adds texture and warmth to any room.",
    price: 65.00,
    originalPrice: 78.00,
    image: "/attached_assets/stock_images/handwoven_textile_ba_05ea204c.jpg",
    category: "Home Decor",
    rating: 4.8,
    reviewCount: 19,
    inStock: true,
    featured: false,
  },
];

const initialReviews: Review[] = [
  {
    id: "rev-1",
    productId: "prod-1",
    reviewerName: "Sarah M.",
    rating: 5,
    comment: "Absolutely beautiful bowls! They look even better in person. The glaze is stunning and they're perfect for everyday use.",
    verified: true,
    helpful: 12,
    createdAt: new Date("2024-10-15"),
  },
  {
    id: "rev-2",
    productId: "prod-1",
    reviewerName: "James K.",
    rating: 5,
    comment: "Great quality and very unique. Each bowl is slightly different which adds to the charm. Highly recommend!",
    verified: true,
    helpful: 8,
    createdAt: new Date("2024-10-20"),
  },
  {
    id: "rev-3",
    productId: "prod-4",
    reviewerName: "Emily R.",
    rating: 5,
    comment: "Best honey I've ever tasted! You can really taste the difference with local, raw honey. Will definitely be ordering more.",
    verified: true,
    helpful: 15,
    createdAt: new Date("2024-11-01"),
  },
  {
    id: "rev-4",
    productId: "prod-6",
    reviewerName: "Michael T.",
    rating: 4,
    comment: "Love the lavender scent - not too overpowering. Burns clean and lasts a long time. Only wish it was a bit stronger.",
    verified: true,
    helpful: 6,
    createdAt: new Date("2024-11-05"),
  },
  {
    id: "rev-5",
    productId: "prod-8",
    reviewerName: "Lisa H.",
    rating: 5,
    comment: "These soaps are amazing! My skin has never felt better. The honey oat is my favorite. No artificial fragrances.",
    verified: true,
    helpful: 20,
    createdAt: new Date("2024-11-10"),
  },
  {
    id: "rev-6",
    productId: "prod-10",
    reviewerName: "David W.",
    rating: 5,
    comment: "Gorgeous cutting board! The walnut grain is beautiful and it's very sturdy. A bit heavy but that's a good thing.",
    verified: true,
    helpful: 9,
    createdAt: new Date("2024-11-12"),
  },
];

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private reviews: Map<string, Review>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map();
    this.reviews = new Map();
    this.orders = new Map();

    initialProducts.forEach((product) => {
      this.products.set(product.id, product);
    });

    initialReviews.forEach((review) => {
      this.reviews.set(review.id, review);
    });
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
  }

  async getReviews(productId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((review) => review.productId === productId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
      verified: false,
      helpful: 0,
    };
    this.reviews.set(id, review);

    const product = this.products.get(insertReview.productId);
    if (product) {
      const productReviews = await this.getReviews(insertReview.productId);
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / productReviews.length;
      
      this.products.set(product.id, {
        ...product,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: productReviews.length,
      });
    }

    return review;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (order) {
      const updatedOrder = { ...order, status };
      this.orders.set(id, updatedOrder);
      return updatedOrder;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
