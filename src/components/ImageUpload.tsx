"use client";

import Image from "next/image";
import { Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  selectedImage: string | null;
  onFileClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ImageUpload({
  selectedImage,
  onFileClick,
  onFileChange,
  fileInputRef,
}: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image" className="text-sm font-medium">
        Photo of Your Missing Bike *
      </Label>
      <div className="flex items-center justify-start">
        <button
          type="button"
          onClick={onFileClick}
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
        onChange={onFileChange}
      />
      <p className="text-xs text-muted-foreground">
        Upload a clear photo of your missing bike for best results
      </p>
    </div>
  );
}

