"use server";

import {
  searchEbayBikes,
  buildSearchKeywords,
  EbaySearchResult,
} from "@/lib/ebayApi";
import {
  generateImageHash,
  calculateSimilarity,
  downloadImage,
  processImageBuffer,
} from "@/lib/imageUtils";

export interface BikeSearchResult extends EbaySearchResult {
  similarityScore: number;
}

/**
 * Server Action to search for bikes on eBay and compare images
 * @param formData - Form data containing image and bike details
 * @returns Promise<BikeSearchResult[]> - Array of results sorted by similarity
 */
export async function searchBikes(
  formData: FormData
): Promise<BikeSearchResult[]> {
  try {
    // Check for required environment variables first
    if (!process.env.EBAY_CLIENT_ID) {
      throw new Error(
        "EBAY_CLIENT_ID environment variable is not set. Please create a .env.local file with your eBay Client ID."
      );
    }

    // Extract data from FormData
    const imageFile = formData.get("image") as File;
    const brand = formData.get("brand") as string;
    const model = formData.get("model") as string;
    const color = formData.get("color") as string;

    if (!imageFile) {
      throw new Error("Please select an image");
    }

    // Step 1: Process the uploaded image and generate perceptual hash
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const processedImageBuffer = await processImageBuffer(imageBuffer);
    const userImageHash = await generateImageHash(processedImageBuffer);

    // Step 2: Build search keywords and call eBay API
    const keywords = buildSearchKeywords(brand, model, color);
    const ebayResults = await searchEbayBikes(keywords, 20);

    if (ebayResults.length === 0) {
      return [];
    }

    // Step 3: Download and compare each listing image
    const resultsWithSimilarity: BikeSearchResult[] = [];

    for (const result of ebayResults) {
      try {
        // Skip results without images
        if (!result.image?.imageUrl) {
          continue;
        }

        // Download the listing image
        const listingImageBuffer = await downloadImage(result.image.imageUrl);
        const processedListingBuffer = await processImageBuffer(
          listingImageBuffer
        );

        // Generate hash for the listing image
        const listingImageHash = await generateImageHash(
          processedListingBuffer
        );

        // Calculate similarity
        const similarityScore = calculateSimilarity(
          userImageHash,
          listingImageHash
        );

        resultsWithSimilarity.push({
          ...result,
          similarityScore,
        });
      } catch (error) {
        // Continue with other results even if one fails
        continue;
      }
    }

    // Step 4: Sort by similarity score (highest first)
    const sortedResults = resultsWithSimilarity.sort(
      (a, b) => b.similarityScore - a.similarityScore
    );

    return sortedResults;
  } catch (error) {
    throw new Error(
      `Search failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
