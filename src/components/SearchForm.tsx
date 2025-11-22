"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ImageUpload } from "./ImageUpload";

interface SearchFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  selectedImage: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function SearchForm({
  onSubmit,
  loading,
  selectedImage,
  onFileChange,
  onFileClick,
  fileInputRef,
}: SearchFormProps) {
  return (
    <Card className="mb-8">
      <CardContent className="p-8">
        <form onSubmit={onSubmit} className="space-y-6">
          <ImageUpload
            selectedImage={selectedImage}
            onFileClick={onFileClick}
            onFileChange={onFileChange}
            fileInputRef={fileInputRef}
          />

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
  );
}

