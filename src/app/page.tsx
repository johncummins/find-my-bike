"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { searchBikes, BikeSearchResult } from "@/app/actions/searchBikes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ExternalLink, AlertCircle, Plus, Bike } from "lucide-react";

export default function Home() {
  const [results, setResults] = useState<BikeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-serif text-foreground mb-2">
            Find My Bike
          </h1>
          <p className="text-lg font-sans text-muted-foreground">
            Upload a photo of your missing bike and find similar listings on
            eBay UK
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <form action={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label
                  htmlFor="image"
                  className="text-sm font-medium font-sans">
                  Photo of Your Missing Bike *
                </Label>
                <div className="flex items-center justify-start">
                  {selectedImage ? (
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Selected bike"
                        className="h-24 w-24 rounded-lg object-cover border-2 border-primary"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleFileClick}
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-background border-2 hover:bg-primary hover:text-primary-foreground cursor-pointer">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={handleFileClick}
                      className="h-24 w-24 rounded-lg border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                      <Plus className="h-8 w-8 text-muted-foreground" />
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs font-sans text-muted-foreground">
                  Upload a clear photo of your missing bike for best results
                </p>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand" className="font-sans">
                    Brand
                  </Label>
                  <Input
                    type="text"
                    id="brand"
                    name="brand"
                    placeholder="e.g., Trek, Specialized"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model" className="font-sans">
                    Model
                  </Label>
                  <Input
                    type="text"
                    id="model"
                    name="model"
                    placeholder="e.g., Domane, Stumpjumper"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color" className="font-sans">
                    Color
                  </Label>
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
                  className="min-w-[200px] cursor-pointer">
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
            <AlertDescription className="font-sans">{error}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-serif text-foreground mb-2">
                Search Results
              </h2>
              <p className="text-muted-foreground font-sans">
                Found {results.length} similar bikes that might match your
                missing bike, sorted by visual similarity
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <Card
                  key={result.itemId}
                  className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    {result.image.imageUrl && (
                      <Image
                        src={result.image.imageUrl}
                        alt={result.title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const placeholder =
                            target.parentElement?.querySelector(
                              ".image-placeholder"
                            ) as HTMLElement;
                          if (placeholder) {
                            placeholder.style.display = "flex";
                          }
                        }}
                      />
                    )}
                    <div
                      className={`image-placeholder absolute inset-0 ${
                        !result.image.imageUrl ? "flex" : "hidden"
                      } flex-col items-center justify-center bg-slate-50 border border-slate-200`}>
                      <Bike className="w-12 h-12 text-slate-400 mb-2" />
                      <p className="text-slate-500 text-sm font-medium">
                        Image Unavailable
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {/* Title */}
                    <h3 className="font-medium font-sans text-foreground mb-2 line-clamp-2">
                      {result.title}
                    </h3>

                    {/* Price */}
                    <div className="text-lg font-bold font-sans text-green-600 mb-3">
                      {result.price.currency} {result.price.value}
                    </div>

                    {/* Similarity Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium font-sans text-muted-foreground">
                          Similarity
                        </span>
                        <Badge variant="secondary" className="font-mono">
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
                      <div className="text-sm font-sans text-muted-foreground mb-3">
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
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardContent className="p-8 text-center">
              <Spinner className="h-8 w-8 mx-auto mb-4" />
              <p className="font-sans text-muted-foreground">
                Searching eBay for bikes that might match your missing bike...
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
