"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { searchBikesByImage } from "@/app/actions/searchBikesByImage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import {
  Search,
  Upload,
  Bike,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function Home() {
  const [results, setResults] = useState<any[]>([]);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await searchBikesByImage(formData);
      setResults(response.results);
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Photo of Your Missing Bike *
                </Label>
                <div className="flex items-center justify-start">
                  <button
                    type="button"
                    onClick={handleFileClick}
                    className="flex items-center justify-center gap-2 h-24 w-24 rounded-lg border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                    {selectedImage ? (
                      <div className="relative w-full h-full rounded">
                        <Image
                          src={selectedImage}
                          alt="Selected bike image"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    ) : (
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                  </button>
                </div>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  className="hidden"
                  name="image"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground">
                  Upload a clear photo of your missing bike for best results
                </p>
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="make">Bike Make</Label>
                  <Input
                    id="make"
                    placeholder="e.g., Trek, Specialized"
                    name="make"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">Bike Model</Label>
                  <Input
                    id="model"
                    placeholder="e.g., Domane, Stumpjumper"
                    name="model"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="min-w-[200px] cursor-pointer transition-all duration-200">
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4 animate-spin" />
                      <span className="animate-pulse">Searching...</span>
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
          <Alert className="mb-8" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-sans">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Spinner className="h-8 w-8 animate-spin" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold font-serif text-foreground">
                  Searching eBay...
                </h2>
                <p className="text-muted-foreground font-sans">
                  Searching for bikes matching your image and criteria...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold font-serif text-foreground mb-2">
                Search Results
              </h2>
              <p className="text-muted-foreground font-sans">
                Found {results.length} bikes matching your search
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((result) => (
                <Card key={result.itemId} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Image */}
                    <div className="relative h-48 bg-slate-100">
                      {result.image?.imageUrl ? (
                        <Image
                          src={result.image.imageUrl}
                          alt={result.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Bike className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Title */}
                      <h3 className="font-medium text-sm text-foreground line-clamp-2">
                        {result.title}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">
                          {result.price.currency} {result.price.value}
                        </span>
                        {result.condition && (
                          <Badge variant="outline" className="text-xs">
                            {result.condition}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          asChild
                          size="sm"
                          className="flex-1 cursor-pointer">
                          <a
                            href={result.itemWebUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View on eBay
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
