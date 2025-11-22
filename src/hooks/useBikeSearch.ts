"use client";

import { useState, useRef } from "react";
import { searchBikesByImage } from "@/app/actions/searchBikesByImage";
import { EbaySearchResult } from "@/lib/ebayApi";

export function useBikeSearch() {
  const [results, setResults] = useState<EbaySearchResult[]>([]);
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

  return {
    results,
    loading,
    error,
    selectedImage,
    fileInputRef,
    handleFileClick,
    handleFileChange,
    handleSubmit,
  };
}

