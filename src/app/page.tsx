"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useBikeSearch } from "@/hooks/useBikeSearch";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { LoadingState } from "@/components/LoadingState";
import { ResultsList } from "@/components/ResultsList";

export default function Home() {
  const {
    results,
    loading,
    error,
    selectedImage,
    fileInputRef,
    handleFileClick,
    handleFileChange,
    handleSubmit,
  } = useBikeSearch();

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        <Header />

        <SearchForm
          onSubmit={handleSubmit}
          loading={loading}
          selectedImage={selectedImage}
          onFileChange={handleFileChange}
          onFileClick={handleFileClick}
          fileInputRef={fileInputRef}
        />

        {error && (
          <Alert className="mb-8" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="font-sans">{error}</AlertDescription>
          </Alert>
        )}

        {loading && <LoadingState />}

        <ResultsList results={results} />
      </div>
    </div>
  );
}
