import { Spinner } from "@/components/ui/spinner";

export function LoadingState() {
  return (
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
  );
}

