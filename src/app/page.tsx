"use client";

import { useState } from "react";
import Image from "next/image";
import { searchBikes, BikeSearchResult } from "@/app/actions/searchBikes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Upload, Search, ExternalLink, AlertCircle } from "lucide-react";

export default function Home() {
  const [results, setResults] = useState<BikeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const imageFile = formData.get("image") as File;
      const brand = formData.get("brand") as string;
      const model = formData.get("model") as string;
      const color = formData.get("color") as string;

      if (!imageFile) {
        throw new Error("Please select an image");
      }

      const searchResults = await searchBikes({
        image: imageFile,
        brand: brand || undefined,
        model: model || undefined,
        color: color || undefined,
      });

      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Find My Bike
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload a photo of your bike and find similar listings on eBay UK
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <form action={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Bike Image *
                </Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  required
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                <p className="text-xs text-muted-foreground">
                  Upload a clear photo of your bike for best results
                </p>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    type="text"
                    id="brand"
                    name="brand"
                    placeholder="e.g., Trek, Specialized"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    type="text"
                    id="model"
                    name="model"
                    placeholder="e.g., Domane, Stumpjumper"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    type="text"
                    id="color"
                    name="color"
                    placeholder="e.g., Red, Blue, Black"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="min-w-[200px]">
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Searching eBay...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find My Bike
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {results.length} similar bikes sorted by visual similarity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((result) => (
                  <Card
                    key={result.itemId}
                    className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video relative">
                      <Image
                        src={result.image.imageUrl}
                        alt={result.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder-bike.svg";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      {/* Title */}
                      <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                        {result.title}
                      </h3>

                      {/* Price */}
                      <div className="text-lg font-bold text-green-600 mb-3">
                        {result.price.currency} {result.price.value}
                      </div>

                      {/* Similarity Score */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            Similarity
                          </span>
                          <Badge variant="secondary">
                            {result.similarityScore.toFixed(1)}%
                          </Badge>
                        </div>
                        <Progress
                          value={result.similarityScore}
                          className="h-2"
                        />
                      </div>

                      {/* Condition */}
                      {result.condition && (
                        <div className="text-sm text-muted-foreground mb-3">
                          Condition: {result.condition}
                        </div>
                      )}

                      {/* eBay Link */}
                      <Button asChild className="w-full" variant="outline">
                        <a
                          href={result.itemWebUrl}
                          target="_blank"
                          rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View on eBay
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Spinner className="h-8 w-8 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Searching eBay and comparing images...
              </p>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
