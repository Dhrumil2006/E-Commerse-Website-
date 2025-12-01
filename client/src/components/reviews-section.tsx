import { useState } from "react";
import { Star, ThumbsUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Review } from "@shared/schema";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview?: (review: { name: string; rating: number; comment: string }) => void;
}

function RatingStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClasses[size]} ${
            i < Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : i < rating
              ? "text-yellow-400 fill-yellow-400/50"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function RatingBreakdown({ reviews }: { reviews: Review[] }) {
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  const total = reviews.length || 1;

  return (
    <div className="space-y-2">
      {ratingCounts.map(({ rating, count }) => (
        <div key={rating} className="flex items-center gap-2">
          <span className="text-sm w-8">{rating} star</span>
          <Progress value={(count / total) * 100} className="flex-1 h-2" />
          <span className="text-sm text-muted-foreground w-8">{count}</span>
        </div>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(false);

  return (
    <Card className="overflow-visible">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{review.reviewerName}</span>
              {review.verified && (
                <Badge variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Verified Purchase
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mb-3">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-sm text-muted-foreground">
                {review.createdAt
                  ? new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Recently"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={helpful ? "text-primary" : ""}
            onClick={() => setHelpful(!helpful)}
            data-testid={`button-helpful-${review.id}`}
          >
            <ThumbsUp className="h-4 w-4 mr-1" />
            Helpful ({(review.helpful || 0) + (helpful ? 1 : 0)})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewsSection({ reviews, averageRating, totalReviews, onSubmitReview }: ReviewsSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitReview) {
      onSubmitReview(newReview);
      setNewReview({ name: "", rating: 5, comment: "" });
      setShowReviewForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="lg:w-72 flex-shrink-0 overflow-visible">
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-1">{averageRating.toFixed(1)}</div>
              <RatingStars rating={averageRating} size="lg" />
              <p className="text-sm text-muted-foreground mt-1">
                Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>
            <Separator />
            <RatingBreakdown reviews={reviews} />
            <Button
              className="w-full"
              onClick={() => setShowReviewForm(!showReviewForm)}
              data-testid="button-write-review"
            >
              Write a Review
            </Button>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          {showReviewForm && (
            <Card className="overflow-visible">
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reviewer-name">Your Name</Label>
                    <Input
                      id="reviewer-name"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                      data-testid="input-reviewer-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          data-testid={`button-rating-${star}`}
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= newReview.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-comment">Your Review</Label>
                    <Textarea
                      id="review-comment"
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your experience with this product..."
                      rows={4}
                      required
                      data-testid="textarea-review-comment"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReviewForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" data-testid="button-submit-review">
                      Submit Review
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {reviews.length === 0 ? (
            <Card className="overflow-visible">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
