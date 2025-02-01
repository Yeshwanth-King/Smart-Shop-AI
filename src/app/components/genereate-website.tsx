/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HexColorPicker } from "react-colorful";
import { toast } from "sonner";

interface WebsiteConfig {
  primaryColor: string;
  secondaryColor: string;
  heroImage: string;
  navLinks: string[];
  footerLinks: string[];
  aboutPageImage?: string;
}

interface FormData {
  shopName: string;
  category: string;
  description: string;
  template: string;
}

export default function GeneratedWebsite() {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Add form state
  const [formData, setFormData] = useState<FormData>({
    shopName: "",
    category: "",
    description: "",
    template: "modern",
  });

  const [websiteConfig, setWebsiteConfig] = useState<WebsiteConfig>({
    primaryColor: "#3b82f6",
    secondaryColor: "#1d4ed8",
    heroImage: "",
    navLinks: ["Home", "Products", "About", "Contact"],
    footerLinks: ["Privacy", "Terms", "Contact"],
    aboutPageImage: "",
  });

  const templates = [
    { id: "modern", name: "Modern & Clean" },
    { id: "minimal", name: "Minimal" },
    { id: "bold", name: "Bold & Dynamic" },
  ];

  const handleConfigChange = (key: keyof WebsiteConfig, value: any) => {
    setWebsiteConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Add form change handler
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const shopData = {
      ...formData,
      config: websiteConfig,
    };

    try {
      toast.success("Generating website content...");
      const response = await axios.post("/api/generateContent", shopData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      if (response.status !== 200) {
        throw new Error(data.error || "Failed to generate website");
      }

      setHtmlContent(data.data.htmlContent);
      setActiveTab("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center text-center">
                <h1 className="text-3xl  font-bold text-gray-900">
                  Website Generator
                </h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <form id="websiteForm" onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="basic">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="template">Template Style</Label>
                    <Select
                      value={formData.template}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, template: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopName">Business Name</Label>
                    <Input
                      id="shopName"
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Business Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g., Restaurant, Retail, Service"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      required
                      rows={4}
                      placeholder="Describe your business..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <Label>Primary Color</Label>
                    <HexColorPicker
                      color={websiteConfig.primaryColor}
                      onChange={(color) =>
                        handleConfigChange("primaryColor", color)
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Secondary Color</Label>
                    <HexColorPicker
                      color={websiteConfig.secondaryColor}
                      onChange={(color) =>
                        handleConfigChange("secondaryColor", color)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heroImage">Hero Image URL</Label>
                    <Input
                      id="heroImage"
                      value={websiteConfig.heroImage}
                      onChange={(e) =>
                        handleConfigChange("heroImage", e.target.value)
                      }
                      placeholder="Enter image URL or use default"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutPageImage">About Page Image URL</Label>
                    <Input
                      id="aboutPageImage"
                      value={websiteConfig.aboutPageImage || ""}
                      onChange={(e) =>
                        handleConfigChange("aboutPageImage", e.target.value)
                      }
                      placeholder="Enter image URL for the About page"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="navigation">
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label>Navigation Links</Label>
                    {websiteConfig.navLinks.map((link, index) => (
                      <Input
                        key={index}
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...websiteConfig.navLinks];
                          newLinks[index] = e.target.value;
                          handleConfigChange("navLinks", newLinks);
                        }}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        handleConfigChange("navLinks", [
                          ...websiteConfig.navLinks,
                          "New Link",
                        ])
                      }
                    >
                      Add Nav Link
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label>Footer Links</Label>
                    {websiteConfig.footerLinks.map((link, index) => (
                      <Input
                        key={index}
                        value={link}
                        onChange={(e) => {
                          const newLinks = [...websiteConfig.footerLinks];
                          newLinks[index] = e.target.value;
                          handleConfigChange("footerLinks", newLinks);
                        }}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        handleConfigChange("footerLinks", [
                          ...websiteConfig.footerLinks,
                          "New Link",
                        ])
                      }
                    >
                      Add Footer Link
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mb-4"
                  >
                    {isLoading ? "Generating..." : "Generate Website"}
                  </Button>

                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {htmlContent && (
                    <div className="border rounded-lg overflow-hidden">
                      <iframe
                        srcDoc={htmlContent}
                        className="w-full h-[800px]"
                        title="Generated Website Preview"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </form>
        </Tabs>
      </main>
    </div>
  );
}
