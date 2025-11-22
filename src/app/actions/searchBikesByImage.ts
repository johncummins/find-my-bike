"use server";

import { searchByImage, EbaySearchResult } from "@/lib/ebayApi";

export interface SearchBikesByImageResponse {
  results: EbaySearchResult[];
  totalFound: number;
}

/**
 * Search for bikes by image, make, and model
 */
export async function searchBikesByImage(
  formData: FormData
): Promise<SearchBikesByImageResponse> {
  try {
    // Check for required environment variables
    if (!process.env.EBAY_CLIENT_ID) {
      throw new Error(
        "EBAY_CLIENT_ID environment variable is not set. Please create a .env.local file with your eBay Client ID."
      );
    }

    // Extract data from FormData
    const imageFile = formData.get("image") as File;
    const make = formData.get("make") as string;
    const model = formData.get("model") as string;

    if (!imageFile) {
      throw new Error("Please select an image");
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Search using search_by_image function
    const results = await searchByImage(imageBuffer, make || "", model || "");

    return {
      results,
      totalFound: results.length,
    };
  } catch (error) {
    console.error("Search by image failed:", error);
    throw new Error(
      `Search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

