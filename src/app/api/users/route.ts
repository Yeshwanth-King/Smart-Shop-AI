import { NextResponse } from "next/server";
import { supabase } from "../../lib/supabase";
console.log("🚀 API Route Loaded: /api/users");

export async function POST(req: Request) {
  try {
    const { id, email, name, avatar_url } = await req.json();

    if (!id || !email) {
      return NextResponse.json({ error: "ID and email are required" }, { status: 400 });
    }

    const { data, error } = await supabase.from("users").upsert([
      { id, email, name, avatar_url }
    ]);

    if (error) {
      console.log(error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User saved", data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request"+error }, { status: 400 });
  }
}

export async function GET() {
    try {
        const { data, error } = await supabase.from("users").select("*");

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Invalid request"+error }, { status: 400 });
    }
}
