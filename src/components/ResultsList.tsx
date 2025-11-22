import { EbaySearchResult } from "@/lib/ebayApi";
import { BikeCard } from "./BikeCard";
import { Search } from "lucide-react";

interface ResultsListProps {
  results: EbaySearchResult[];
  hasSearched?: boolean;
  loading?: boolean;
  error?: string | null;
}

export function ResultsList({
  results,
  hasSearched = false,
  loading = false,
  error,
}: ResultsListProps) {
  if (!hasSearched) {
    return null;
  }

  // Don't show empty state while loading
  if (loading) {
    return null;
  }

  // Don't show empty state if there's an error (e.g., validation error)
  if (error) {
    return null;
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
          <div className="rounded-full bg-muted p-6">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-serif text-foreground">
              No Results Found
            </h2>
            <p className="text-muted-foreground font-sans">
              We couldn&apos;t find any bikes matching your search. Try adjusting
              your search criteria or uploading a different photo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="my-6">
        <h2 className="text-2xl font-bold font-serif text-foreground mb-2">
          Search Results
        </h2>
        <p className="text-muted-foreground font-sans">
          Found {results.length} {results.length === 1 ? "bike" : "bikes"}{" "}
          matching your search
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <BikeCard key={result.itemId} result={result} />
        ))}
      </div>
    </div>
  );
}
