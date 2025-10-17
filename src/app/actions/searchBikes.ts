'use server';

import { searchEbayBikes, buildSearchKeywords, EbaySearchResult } from '@/lib/ebayApi';
import { 
  generateImageHash, 
  calculateSimilarity, 
  downloadImage, 
  processImageBuffer 
} from '@/lib/imageUtils';

export interface BikeSearchResult extends EbaySearchResult {
  similarityScore: number;
}

export interface SearchFormData {
  image: File;
  brand?: string;
  model?: string;
  color?: string;
}

/**
 * Server Action to search for bikes on eBay and compare images
 * @param formData - Form data containing image and bike details
 * @returns Promise<BikeSearchResult[]> - Array of results sorted by similarity
 */
export async function searchBikes(formData: SearchFormData): Promise<BikeSearchResult[]> {
  try {
    console.log('Starting bike search...');
    
    // Step 1: Process the uploaded image and generate perceptual hash
    console.log('Processing uploaded image...');
    const imageBuffer = Buffer.from(await formData.image.arrayBuffer());
    const processedImageBuffer = await processImageBuffer(imageBuffer);
    const userImageHash = await generateImageHash(processedImageBuffer);
    
    console.log('Generated user image hash:', userImageHash);
    
    // Step 2: Build search keywords and call eBay API
    console.log('Building search keywords...');
    const keywords = buildSearchKeywords(formData.brand, formData.model, formData.color);
    console.log('Search keywords:', keywords);
    
    console.log('Searching eBay...');
    const ebayResults = await searchEbayBikes(keywords, 20);
    console.log(`Found ${ebayResults.length} eBay results`);
    
    if (ebayResults.length === 0) {
      console.log('No eBay results found');
      return [];
    }
    
    // Step 3: Download and compare each listing image
    console.log('Comparing images...');
    const resultsWithSimilarity: BikeSearchResult[] = [];
    
    for (const result of ebayResults) {
      try {
        // Skip results without images
        if (!result.image?.imageUrl) {
          console.log(`Skipping result ${result.itemId} - no image`);
          continue;
        }
        
        console.log(`Processing image for ${result.itemId}...`);
        
        // Download the listing image
        const listingImageBuffer = await downloadImage(result.image.imageUrl);
        const processedListingBuffer = await processImageBuffer(listingImageBuffer);
        
        // Generate hash for the listing image
        const listingImageHash = await generateImageHash(processedListingBuffer);
        
        // Calculate similarity
        const similarityScore = calculateSimilarity(userImageHash, listingImageHash);
        
        console.log(`Similarity score for ${result.itemId}: ${similarityScore.toFixed(2)}%`);
        
        resultsWithSimilarity.push({
          ...result,
          similarityScore,
        });
        
      } catch (error) {
        console.error(`Error processing image for ${result.itemId}:`, error);
        // Continue with other results even if one fails
        continue;
      }
    }
    
    // Step 4: Sort by similarity score (highest first)
    const sortedResults = resultsWithSimilarity.sort((a, b) => b.similarityScore - a.similarityScore);
    
    console.log(`Returning ${sortedResults.length} results sorted by similarity`);
    return sortedResults;
    
  } catch (error) {
    console.error('Error in searchBikes:', error);
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
