import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { generateHTML, generateSEO, generateWebsiteContent } from "@/app/http";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    // Ensure params are awaited properly in Next.js Edge functions
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    const { id } = await request.json();

    console.log(id);

    // Fetch website data
    const { data: website, error: websiteError } = await supabase.from("websites").select("*").eq("id", id).single();

    if (websiteError) {
      console.error("Website fetch error:", websiteError);
      return NextResponse.json({ error: "Failed to fetch website data" }, { status: 500 });
    }

    if (!website) {
      return NextResponse.json({ error: "Website not found" }, { status: 404 });
    }

    // Fetch navigation and footer links
    const { data: links, error: linksError } = await supabase
      .from("website_nav_links")
      .select("*")
      .eq("website_id", id)
      .order("link_order");

    if (linksError) {
      console.error("Links fetch error:", linksError);
      return NextResponse.json({ error: "Failed to fetch website links" }, { status: 500 });
    }

    // Prepare the data for generateHTML
    const config = {
      primaryColor: website.primary_color,
      secondaryColor: website.secondary_color,
      heroImage: website.hero_image,
      aboutPageImage: website.about_page_image,
      navLinks: links.filter((link) => link.link_type === "nav").map((link) => link.link_text),
      footerLinks: links.filter((link) => link.link_type === "footer").map((link) => link.link_text),
    };

    const shopData = {
      shopName: website.shop_name,
      category: website.category,
      description: website.description,
      config,
      links,
    };

    // Generate website content and HTML
    const websiteContent = await generateWebsiteContent(shopData);
    if (!websiteContent) {
      throw new Error("Failed to generate website content");
    }

    const seoMetadata = await generateSEO(shopData, websiteContent);
    if (!seoMetadata) {
      throw new Error("Failed to generate SEO metadata");
    }

    const htmlContent = await generateHTML(websiteContent, shopData.config);
    if (!htmlContent) {
      throw new Error("Failed to generate HTML content");
    }

    return NextResponse.json({ htmlContent });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
