"use client";

import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadProps {
  selectedImage: string | null;
  onFileClick: () => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ImageUpload({
  selectedImage,
  onFileClick,
  onFileChange,
  onRemoveImage,
  fileInputRef,
}: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="image" className="text-sm font-medium">
        Photo of Your Missing Bike *
      </Label>
      <div className="flex items-center justify-start gap-2">
        <button
          type="button"
          onClick={onFileClick}
          className="flex items-center justify-center gap-2 h-24 w-24 rounded-lg border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer relative">
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
        {selectedImage && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveImage();
            }}
            className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground hover:scale-110 transition-all cursor-pointer"
            aria-label="Remove image">
            <X className="h-4 w-4" />
          </button>
        )}
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
      <p className="text-[14px] text-muted-foreground">
        Upload a clear photo of your missing bike for best results
      </p>
    </div>
  );
}

