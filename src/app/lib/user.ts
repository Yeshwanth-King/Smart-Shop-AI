import { supabase } from "./supabase";

interface User {
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
}
export async function createUser(data: User) {
  try {
    const { data: user, error } = await supabase.from("users").insert([data]);

    if (error) throw error;
    return { user };
  } catch (error) {
    return { error };
  }
}

export async function getUserById({
  id,
  clerkUserId,
}: {
  id?: string;
  clerkUserId?: string;
}) {
  try {
    if (!id && !clerkUserId) {
      throw new Error("id or clerkUserId is required");
    }

    const query = id ? { id } : { clerkUserId };

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq(Object.keys(query)[0], Object.values(query)[0])
      .single();

    if (error) throw error;
    return { user };
  } catch (error) {
    return { error };
  }
}

export async function updateUser(
  id: string,
  data: Partial<{ name: string; profileImage: string }>
) {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .update(data)
      .eq("id", id)
      .single();

    if (error) throw error;
    return { user };
  } catch (error) {
    return { error };
  }
}
