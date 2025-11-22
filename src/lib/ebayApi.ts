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
}

interface EbayApiItemSummary {
  itemId: string;
  title: string;
  price?: {
    value: string;
    currency: string;
  };
  image?: {
    imageUrl: string;
  };
  itemWebUrl: string;
  condition?: string;
}

export interface EbayApiResponse {
  itemSummaries: EbayApiItemSummary[];
  total: number;
}

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
  } catch {
    throw new Error("Failed to authenticate with eBay API");
  }
}

/**
 * Search eBay by image, make, and model
 * Uses eBay's search_by_image endpoint with Base64 image and aspect filters
 * @param imageBuffer - The image buffer to search with
 * @param make - Bike make/brand
 * @param model - Bike model
 * @param limit - Maximum number of results (default: 50)
 * @returns Promise<EbaySearchResult[]> - Array of search results
 */
export async function searchByImage(
  imageBuffer: Buffer,
  make: string,
  model: string,
  limit: number = 50
): Promise<EbaySearchResult[]> {
  try {
    // Get OAuth access token
    const accessToken = await getEbayAccessToken();

    // Convert image buffer to Base64 string
    const base64Image = imageBuffer.toString("base64");

    // Build aspect filter for make and model
    const categoryId = "177831"; // Bicycles category ID

    // Build query parameters
    const params: Record<string, string> = {
      category_ids: categoryId,
      limit: limit.toString(),
      filter: "deliveryCountry:GB,conditionIds:{3000|4000|5000}", // UK, New/Used/Refurbished
    };

    // Build aspect filter if we have make or model
    // Note: Aspect names may vary by category, common ones are Brand/Make and Model
    if (make || model) {
      const aspectFilters: string[] = [`categoryId:${categoryId}`];

      if (make) {
        // Try both "Brand" and "Make" as aspect names
        // Escape special characters in make (e.g., pipe symbols)
        const escapedMake = make.replace(/\|/g, "\\|").trim();
        if (escapedMake) {
          // Use "Brand" as it's more common in eBay's bicycle category
          aspectFilters.push(`Brand:{${escapedMake}}`);
        }
      }

      if (model) {
        // Escape special characters in model
        const escapedModel = model.replace(/\|/g, "\\|").trim();
        if (escapedModel) {
          aspectFilters.push(`Model:{${escapedModel}}`);
        }
      }

      if (aspectFilters.length > 1) {
        // Only add aspect filter if we have at least one aspect beyond categoryId
        params.aspect_filter = aspectFilters.join(",");
      }
    }

    // POST request to search_by_image endpoint
    const response = await axios.post<EbayApiResponse>(
      "https://api.ebay.com/buy/browse/v1/item_summary/search_by_image",
      {
        image: base64Image,
      },
      {
        params,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_GB", // UK marketplace
        },
      }
    );

    // Map the API response to our EbaySearchResult format
    return (response.data.itemSummaries || []).map((item) => ({
      itemId: item.itemId,
      title: item.title,
      price: item.price || { value: "0", currency: "GBP" },
      image: item.image || { imageUrl: "" },
      itemWebUrl: item.itemWebUrl,
      condition: item.condition,
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.errors?.[0]?.message ||
        errorData?.message ||
        error.response?.statusText ||
        "Unknown error";

      console.error("eBay search_by_image error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        error: errorMessage,
        hasMake: !!make,
        hasModel: !!model,
      });

      throw new Error(
        `eBay API request failed: ${error.response?.status} ${errorMessage}`
      );
    }
    console.error("Unexpected error in searchByImage:", error);
    throw new Error("Failed to search eBay by image");
  }
}
