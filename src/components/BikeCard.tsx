"use client";

import Image from "next/image";
import { Bike, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EbaySearchResult } from "@/lib/ebayApi";

interface BikeCardProps {
  result: EbaySearchResult;
}

export function BikeCard({ result }: BikeCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <CardContent className="p-0 flex flex-col h-full">
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

        <div className="p-4 flex flex-col flex-1">
          <div className="flex-1">
            <h3 className="font-medium text-sm text-foreground line-clamp-2">
              {result.title}
            </h3>
          </div>

          <div className="mt-4">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-full cursor-pointer">
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
  );
}
