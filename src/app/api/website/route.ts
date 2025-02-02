import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
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
    const htmlContent = website.htmlContent;
    

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
