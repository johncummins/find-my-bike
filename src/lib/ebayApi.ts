import axios from "axios";

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
// Get OAuth 2.0 access token for eBay API
async function getEbayAccessToken(): Promise<string> {
  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId) {
    throw new Error("EBAY_CLIENT_ID environment variable is not set");
  }

  if (!clientSecret) {
    throw new Error("EBAY_CLIENT_SECRET environment variable is not set");
  }

  try {
    const response = await axios.post(
      "https://api.ebay.com/identity/v1/oauth2/token",
      "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64")}`,
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error("Failed to authenticate with eBay API");
  }
}

export async function searchEbayBikes(
  keywords: string,
  limit: number = 20
): Promise<EbaySearchResult[]> {
  try {
    // Get OAuth access token
    const accessToken = await getEbayAccessToken();

    const response = await axios.get<EbayApiResponse>(
      "https://api.ebay.com/buy/browse/v1/item_summary/search",
      {
        params: {
          q: keywords,
          itemLocationCountry: "GB",
          limit: limit.toString(),
          category_ids: "177831", // Bicycles category ID
          filter: "deliveryCountry:GB,conditionIds:{3000|4000|5000}", // New, Used, Refurbished
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB", // UK marketplace
        },
      }
    );

    return response.data.itemSummaries || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `eBay API request failed: ${error.response?.status} ${error.response?.statusText}`
      );
    }
    throw new Error("Failed to search eBay");
  }
}

/**
 * Build search keywords from bike details
 * @param brand - Bike brand
 * @param model - Bike model
 * @param color - Bike color
 * @returns string - Formatted search keywords
 */
export function buildSearchKeywords(
  brand?: string,
  model?: string,
  color?: string
): string {
  const keywords = ["bike", "bicycle"];

  if (brand) {
    keywords.unshift(brand);
  }

  if (model) {
    keywords.push(model);
  }

  if (color) {
    keywords.push(color);
  }

  return keywords.join(" ");
}
