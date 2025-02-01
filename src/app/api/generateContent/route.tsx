import { z } from "zod";
import { NextResponse } from "next/server";
import { generateHTML, generateSEO, generateWebsiteContent } from "@/app/http";

// Define shop schema using Zod
const shopSchema = z.object({
  shopName: z.string(),
  category: z.string(),
  description: z.string(),
  config: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    heroImage: z.string(),
    navLinks: z.array(z.string()),
    footerLinks: z.array(z.string()),
    aboutPageImage: z.string(),
  }),
});

// Define the type for the shop data
// type ShopData = z.infer<typeof shopSchema>;

// API handler
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const json = await request.json();
    const shopData = shopSchema.parse(json);

    const websiteContent = await generateWebsiteContent(shopData);
    if (!websiteContent) throw new Error("Failed to generate website content");

    const seoMetadata = await generateSEO(shopData, websiteContent);
    if (!seoMetadata) throw new Error("Failed to generate SEO metadata");

    const htmlContent = await generateHTML(websiteContent, shopData.config);
    if (!htmlContent) throw new Error("Failed to generate HTML content");

    return NextResponse.json({
      success: true,
      data: { shopData, websiteContent, seoMetadata, htmlContent },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// Export the config to specify the runtime
export const runtime = "edge"; // optional
