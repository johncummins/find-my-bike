import sharp from "sharp";

/**
 * Generate a perceptual hash for an image buffer using Sharp
 * @param imageBuffer - The image buffer to hash
 * @returns Promise<string> - The perceptual hash as a binary string
 */
export async function generateImageHash(imageBuffer: Buffer): Promise<string> {
  try {
    // Resize to 8x8 and convert to grayscale
    const { data } = await sharp(imageBuffer)
      .resize(8, 8, { fit: "fill" })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Calculate average pixel value
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    const average = sum / data.length;

    // Generate hash: 1 if pixel > average, 0 otherwise
    let hash = "";
    for (let i = 0; i < data.length; i++) {
      hash += data[i] > average ? "1" : "0";
    }

    return hash;
  } catch (error) {
    console.error("Error generating image hash:", error);
    throw new Error("Failed to generate image hash");
  }
}

/**
 * Calculate Hamming distance between two perceptual hashes
 * @param hash1 - First hash
 * @param hash2 - Second hash
 * @returns number - Hamming distance (lower = more similar)
 */
export function calculateHammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) {
    throw new Error("Hashes must be the same length");
  }

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      distance++;
    }
  }
  return distance;
}

/**
 * Calculate similarity percentage between two hashes
 * @param hash1 - First hash
 * @param hash2 - Second hash
 * @returns number - Similarity percentage (0-100, higher = more similar)
 */
export function calculateSimilarity(hash1: string, hash2: string): number {
  const distance = calculateHammingDistance(hash1, hash2);
  const maxDistance = hash1.length; // Blockhash returns binary string
  return Math.max(0, ((maxDistance - distance) / maxDistance) * 100);
}

/**
 * Download an image from a URL and return as buffer
 * @param imageUrl - URL of the image to download
 * @returns Promise<Buffer> - Image buffer
 */
export async function downloadImage(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Process an image buffer to ensure it's in a compatible format
 * @param imageBuffer - Raw image buffer
 * @returns Promise<Buffer> - Processed image buffer
 */
export async function processImageBuffer(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Use sharp to convert to a standard format and resize if needed
    return await sharp(imageBuffer)
      .resize(300, 300, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();
  } catch (error) {
    // If sharp processing fails, return original buffer
    console.warn("Image processing failed, using original buffer:", error);
    return imageBuffer;
  }
}
