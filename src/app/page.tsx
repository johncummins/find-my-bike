"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useBikeSearch } from "@/hooks/useBikeSearch";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { LoadingState } from "@/components/LoadingState";
import { ResultsList } from "@/components/ResultsList";
import { Footer } from "@/components/Footer";

export default function Home() {
  const {
    results,
    loading,
    error,
    selectedImage,
    hasSearched,
    fileInputRef,
    handleFileClick,
    handleFileChange,
    handleRemoveImage,
    handleSubmit,
  } = useBikeSearch();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 pt-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <Header />

          <SearchForm
            onSubmit={handleSubmit}
            loading={loading}
            selectedImage={selectedImage}
            onFileChange={handleFileChange}
            onFileClick={handleFileClick}
            onRemoveImage={handleRemoveImage}
            fileInputRef={fileInputRef}
          />

          {error && (
            <Alert className="mt-8" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="font-sans">{error}</AlertDescription>
            </Alert>
          )}

          {loading && <LoadingState />}

          <ResultsList
            results={results}
            hasSearched={hasSearched}
            loading={loading}
            error={error}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
