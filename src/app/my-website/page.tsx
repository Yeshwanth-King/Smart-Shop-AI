/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/websites.tsx (or app/websites/page.tsx if using Next.js App Router)
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // to handle routing
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface Website {
  id: string;
  shop_name: string;
}

const WebsitesPage = () => {
  const router = useRouter();
  const { user } = useUser();
  const [websites, setWebsites] = useState<Website[]>([]);

  const handleRowClick = (websiteId: string) => {
    // Redirect to website preview page
    router.push(`/website/${websiteId}`);
  };
  const fetchWebsites = async () => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
    const { data, error } = await supabase
      .from("websites")
      .select("id, shop_name")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching websites:", error);
    } else {
      setWebsites(data);
    }
  };

  useEffect(() => {
    if (user) {
      fetchWebsites();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Websites</h1>
      <div>
        <h2 className="text-xl font-semibold mb-2">Website List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Shop Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {websites.length == 0 ? (
                <tr>
                  <td colSpan={2} className="text-center py-4">
                    No websites found
                  </td>
                </tr>
              ) : (
                websites?.map((website: { id: string; shop_name: any }) => (
                  <tr
                    key={website.id}
                    onClick={() => handleRowClick(website.id)}
                    className="cursor-pointer hover:bg-gray-100 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 border-b">
                      {website.shop_name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-b">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
                        View Preview
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WebsitesPage;
