// app/api/generateContent/route.ts
import { z } from "zod";
import { NextResponse, NextRequest } from "next/server";
import { generateHTML, generateSEO, generateWebsiteContent } from "@/app/http";
import { getAuth } from "@clerk/nextjs/server";
import { supabase } from "@/app/lib/supabase";


// Define shop schema using Zod
const shopSchema = z.object({
  shopName: z.string(),
  category: z.string(),
  description: z.string(),
  template: z.string(),
  config: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    heroImage: z.string(),
    navLinks: z.array(z.string()),
    footerLinks: z.array(z.string()),
    aboutPageImage: z.string(),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Get the current user's session from Clerk
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const json = await request.json();
    const shopData = shopSchema.parse(json);

    const websiteContent = await generateWebsiteContent(shopData);
    if (!websiteContent) throw new Error("Failed to generate website content");

    const seoMetadata = await generateSEO(shopData, websiteContent);
    if (!seoMetadata) throw new Error("Failed to generate SEO metadata");

    const htmlContent = await generateHTML(websiteContent, shopData.config);
    if (!htmlContent) throw new Error("Failed to generate HTML content");

    // Store website data in Supabase
    const { data: website, error: websiteError } = await supabase
      .from("websites")
      .insert({
        user_id: userId,
        shop_name: shopData.shopName,
        category: shopData.category,
        description: shopData.description,
        template: shopData.template,
        primary_color: shopData.config.primaryColor,
        secondary_color: shopData.config.secondaryColor,
        hero_image: shopData.config.heroImage || null,
        about_page_image: shopData.config.aboutPageImage || null,
      })
      .select()
      .single();

    if (websiteError) {
      console.error("Website Error:", websiteError);
      throw new Error("Failed to store website data");
    }

    if (!website) {
      throw new Error("No website data returned after insert");
    }

    // Store navigation links
    const navLinks = shopData.config.navLinks.map((link, index) => ({
      website_id: website.id,
      link_text: link,
      link_order: index,
      link_type: "nav" as const,
    }));

    const footerLinks = shopData.config.footerLinks.map((link, index) => ({
      website_id: website.id,
      link_text: link,
      link_order: index,
      link_type: "footer" as const,
    }));

    const { error: linksError } = await supabase
      .from("website_nav_links")
      .insert([...navLinks, ...footerLinks]);

    if (linksError) {
      console.error("Links Error:", linksError);
      throw new Error("Failed to store navigation links");
    }

    return NextResponse.json({
      success: true,
      data: {
        shopData,
        websiteContent,
        seoMetadata,
        htmlContent,
        websiteId: website.id,
      },
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

export const runtime = "edge";
