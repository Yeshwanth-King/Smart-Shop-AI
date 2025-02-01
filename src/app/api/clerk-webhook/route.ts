import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Extract user data from Clerk webhook
  const { id, email_addresses, first_name, last_name, image_url } = payload;

  if (!id || !email_addresses || email_addresses.length === 0) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const email = email_addresses[0].email_address;
  const name = `${first_name || ""} ${last_name || ""}`.trim();

  // Store user details in Supabase
  const { error } = await supabase.from("users").upsert([
    {
      id,
      email,
      name,
      avatar_url: image_url,
    },
  ]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "User synced successfully" });
}
