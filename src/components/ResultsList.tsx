import { EbaySearchResult } from "@/lib/ebayApi";
import { BikeCard } from "./BikeCard";

interface ResultsListProps {
  results: EbaySearchResult[];
}

export function ResultsList({ results }: ResultsListProps) {
  if (results.length === 0) {
    return null;
  }

  return (
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
          <BikeCard key={result.itemId} result={result} />
        ))}
      </div>
    </div>
  );
}

