"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScaleLoader } from "react-spinners";

const WebsitePreview = () => {
  const router = useRouter();
  const path = usePathname();
  const websiteId = path.split("/")[2];
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    if (websiteId) {
      // Fetch website content by websiteId from API or database
      const fetchWebsiteContent = async () => {
        const res = await axios.post(`/api/website`, { id: websiteId });
        const data = res.data;
        setHtmlContent(data.htmlContent);
      };
      fetchWebsiteContent();
    }
  }, [websiteId]);

  // Default values shown

  return (
    <div className="container mx-auto p-4">
      <Button variant={"default"} onClick={() => router.push("/my-website")}>
        <ArrowLeft />
        Back
      </Button>
      <h1 className="text-2xl font-bold mb-4">Website Preview</h1>
      {htmlContent ? (
        <div className="border p-4 rounded">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center  ">
            <p className=" text-xl mb-4">
              Getting your website from database...
            </p>
            <ScaleLoader height={100} radius={10} width={6} className="mt-10" />
          </div>
        </>
      )}
    </div>
  );
};

export default WebsitePreview;
