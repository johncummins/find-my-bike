import { NextRequest, NextResponse } from "next/server";

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
