import axios from 'axios';

export interface EbaySearchResult {
  itemId: string;
  title: string;
  price: {
    value: string;
    currency: string;
  };
  image: {
    imageUrl: string;
  };
  itemWebUrl: string;
  condition?: string;
  brand?: string;
  color?: string;
}

export interface EbayApiResponse {
  itemSummaries: EbaySearchResult[];
  total: number;
}

/**
 * Search eBay UK for bikes using the Browse API
 * @param keywords - Search keywords (brand, model, color)
 * @param limit - Maximum number of results (default: 20)
 * @returns Promise<EbaySearchResult[]> - Array of search results
 */
export async function searchEbayBikes(
  keywords: string,
  limit: number = 20
): Promise<EbaySearchResult[]> {
  const apiKey = process.env.EBAY_API_KEY;
  
  if (!apiKey) {
    throw new Error('EBAY_API_KEY environment variable is not set');
  }

  try {
    const response = await axios.get<EbayApiResponse>(
      'https://api.ebay.com/buy/browse/v1/item_summary/search',
      {
        params: {
          q: keywords,
          itemLocationCountry: 'GB',
          limit: limit.toString(),
          category_ids: '177831', // Bicycles category ID
          filter: 'deliveryCountry:GB,conditionIds:{3000|4000|5000}', // New, Used, Refurbished
        },
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-EBAY-C-MARKETPLACE-ID': 'EBAY_GB', // UK marketplace
        },
      }
    );

    return response.data.itemSummaries || [];
  } catch (error) {
    console.error('eBay API Error:', error);
    if (axios.isAxiosError(error)) {
      throw new Error(`eBay API request failed: ${error.response?.status} ${error.response?.statusText}`);
    }
    throw new Error('Failed to search eBay');
  }
}

/**
 * Build search keywords from bike details
 * @param brand - Bike brand
 * @param model - Bike model
 * @param color - Bike color
 * @returns string - Formatted search keywords
 */
export function buildSearchKeywords(brand?: string, model?: string, color?: string): string {
  const keywords = ['bike', 'bicycle'];
  
  if (brand) {
    keywords.unshift(brand);
  }
  
  if (model) {
    keywords.push(model);
  }
  
  if (color) {
    keywords.push(color);
  }
  
  return keywords.join(' ');
}
