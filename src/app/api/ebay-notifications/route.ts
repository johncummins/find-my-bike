import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

// Your verification token (you'll need to set this in your eBay developer console)
const VERIFICATION_TOKEN =
  process.env.EBAY_VERIFICATION_TOKEN || "your-verification-token-here";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const challengeCode = searchParams.get("challenge_code");

    if (!challengeCode) {
      return NextResponse.json(
        { error: "Missing challenge_code" },
        { status: 400 }
      );
    }

    // Get the endpoint URL from the request
    const endpoint = request.url.split("?")[0]; // Remove query parameters

    // Create the challenge response hash
    // Order: challengeCode + verificationToken + endpoint
    const hash = createHash("sha256");
    hash.update(challengeCode);
    hash.update(VERIFICATION_TOKEN);
    hash.update(endpoint);
    const challengeResponse = hash.digest("hex");

    return NextResponse.json({ challengeResponse });
  } catch (error) {
    console.error("Error processing challenge:", error);
    return NextResponse.json(
      { error: "Failed to process challenge" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log the notification (optional)
    const body = await request.json();
    console.log("eBay notification received:", body);

    // Return success response
    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Error processing eBay notification:", error);
    return NextResponse.json(
      { error: "Failed to process notification" },
      { status: 500 }
    );
  }
}
