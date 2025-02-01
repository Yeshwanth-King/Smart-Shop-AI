/* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from "next/server";
import { z } from "zod";
import model from "@/app/lib/openai";
import { NextResponse } from "next/server";

// Define shop schema using Zod
export const shopSchema = z.object({
  shopName: z.string(),
  category: z.string(),
  description: z.string(),
  config: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    heroImage: z.string(),
    navLinks: z.array(z.string()),
    footerLinks: z.array(z.string()),
  }),
});

type ShopData = z.infer<typeof shopSchema>;

function extractJSONFromText(text: string) {
  try {
    if (!text) throw new Error("Empty response from model");

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;
    if (start === -1 || end === 0) throw new Error("No JSON object found");

    const jsonStr = text.slice(start, end);
    const parsed = JSON.parse(jsonStr);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid JSON structure");
    }

    return parsed;
  } catch (error) {
    console.error("Error extracting JSON:", error);
    throw error; // Re-throw to handle in calling function
  }
}

export async function generateWebsiteContent(shopData: ShopData) {
  const prompt = `Create comprehensive website content for a ${shopData.category} business named "${shopData.shopName}".
    Description: ${shopData.description}
    
    Please generate detailed content formatted as a JSON object with the following structure:
    {
      "businessName": "Business name",
      "headline": "Compelling headline",
      "subheadline": "Supporting subheadline",
      "description": "Main business description",
      "features": [
        {
          "title": "Feature title",
          "description": "Feature description",
          "icon": "suggested-tailwind-icon-name"
        }
      ],
      "services": [
        {
          "title": "Service name",
          "description": "Service description",
          "price": "Price or 'Contact for pricing'"
        }
      ],
      "testimonials": [
        {
          "name": "Client name",
          "role": "Client role/company",
          "text": "Testimonial text"
        }
      ],
      "about": {
        "story": "Company story",
        "mission": "Company mission",
        "values": ["Value 1", "Value 2", "Value 3"]
      },
      "contact": {
        "address": "Business address",
        "phone": "Phone number",
        "email": "Email address",
        "hours": "Business hours"
      },
      "callToAction": {
        "primary": "Primary CTA text",
        "secondary": "Secondary CTA text"
      }
    }`;

  try {
    const completion = await model.generateContent(prompt);
    const responseText = await completion.response.text();
    return extractJSONFromText(responseText);
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate website content");
  }
}

export async function generateSEO(
  shopData: ShopData,
  content: Record<string, any>
) {
  const prompt = `Generate SEO metadata for ${shopData.shopName}, a ${
    shopData.category
  } business.
    Description: ${content.description || shopData.description}
    Format response as a JSON object:
    {
      "title": "SEO title",
      "description": "Meta description",
      "keywords": "keyword1, keyword2, keyword3",
      "structuredData": {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "${shopData.shopName}",
        "description": "Business description"
      }
    }`;

  try {
    const completion = await model.generateContent(prompt);
    const responseText = await completion.response.text();
    return extractJSONFromText(responseText);
  } catch (error) {
    console.error("Error generating SEO:", error);
    throw new Error("Failed to generate SEO metadata");
  }
}

export async function generateHTML(
  content: Record<string, any>,
  config: Record<string, any>
): Promise<any> {
  const {
    primaryColor,
    secondaryColor,
    heroImage,
    navLinks,
    footerLinks,
    aboutPageImage,
  } = config;
  const websiteContent = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.businessName} - ${content.seo?.title || ""}</title>
        <meta name="description" content="${content.seo?.description || ""}">
        <meta name="keywords" content="${content.seo?.keywords || ""}">
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <style>
          :root {
            --primary-color: ${primaryColor};
            --secondary-color: ${secondaryColor};
          }
          .bg-primary { background-color: var(--primary-color); }
          .bg-secondary { background-color: var(--secondary-color); }
          .text-primary { color: var(--primary-color); }
          .text-secondary { color: var(--secondary-color); }
          .btn-primary {
            background-color: var(--primary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 600;
          }
          .btn-secondary {
            background-color: var(--secondary-color);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 600;
          }
        </style>
      </head>
      <body class="bg-gray-50">
        <!-- Navigation -->
        <nav class="bg-white shadow-lg sticky top-0 z-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
              <div class="flex items-center">
                <h1 class="text-xl font-bold text-primary">${
                  content.businessName
                }</h1>
                <div class="hidden md:flex space-x-8 ml-10">
                  ${navLinks
                    .map(
                      (link: string) =>
                        `<a href="#${link.toLowerCase()}" class="text-gray-900 hover:text-primary transition-colors">${link}</a>`
                    )
                    .join("")}
                </div>
              </div>
              <div class="flex items-center">
                <a href="#contact" class="btn-primary">${
                  content.callToAction?.primary || "Contact Us"
                }</a>
              </div>
            </div>
          </div>
        </nav>

        <!-- Hero Section -->
        <div class="relative">
          <img src="${heroImage}" alt="Hero" class="w-full h-[600px] object-cover"/>
          <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
            <h2 class="text-5xl font-bold text-white mb-4">${
              content.headline
            }</h2>
            <p class="text-xl text-white mb-8">${content.subheadline || ""}</p>
            <div class="space-x-4">
              <a href="#contact" class="btn-primary">${
                content.callToAction?.primary || "Get Started"
              }</a>
              <a href="#services" class="btn-secondary">${
                content.callToAction?.secondary || "Learn More"
              }</a>
            </div>
          </div>
        </div>

        <!-- Features Section -->
        <section id="features" class="py-20 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-bold text-gray-900">Why Choose Us</h2>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
              ${content.features
                ?.map(
                  (feature: {
                    title: string;
                    description: string;
                    icon?: string;
                  }) => `
                <div class="text-center p-6 rounded-lg shadow-lg bg-white">
                  <i class="${
                    feature.icon || "fas fa-star"
                  } text-4xl text-primary mb-4"></i>
                  <h3 class="text-xl font-semibold mb-2">${feature.title}</h3>
                  <p class="text-gray-600">${feature.description}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>

        <!-- Services Section -->
        <section id="services" class="py-20 bg-gray-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-bold text-gray-900">Our Services</h2>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
              ${content.services
                ?.map(
                  (service: {
                    title: string;
                    description: string;
                    price: string;
                  }) => `
                <div class="bg-white p-6 rounded-lg shadow-lg">
                  <h3 class="text-xl font-semibold mb-2">${service.title}</h3>
                  <p class="text-gray-600 mb-4">${service.description}</p>
                  <p class="text-primary font-semibold">${service.price}</p>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>

        <!-- Testimonials Section -->
        <section id="testimonials" class="py-20 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
              <h2 class="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
              ${content.testimonials
                ?.map(
                  (testimonial: {
                    name: string;
                    role: string;
                    text: string;
                  }) => `
                <div class="bg-gray-50 p-6 rounded-lg">
                  <p class="text-gray-600 mb-4">"${testimonial.text}"</p>
                  <div class="font-semibold">${testimonial.name}</div>
                  <div class="text-gray-500">${testimonial.role}</div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </section>

        <!-- About Section -->
        <section id="about" class="py-20 bg-gray-50">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-6">About Us</h2>
                <p class="text-gray-600 mb-6">${content.about?.story || ""}</p>
                <h3 class="text-xl font-semibold mb-4">Our Mission</h3>
                <p class="text-gray-600 mb-6">${
                  content.about?.mission || ""
                }</p>
                <div class="space-y-2">
                  ${content.about?.values
                    ?.map(
                      (value: string) =>
                        `<div class="flex items-center">
                      <i class="fas fa-check text-primary mr-2"></i>
                      <span>${value}</span>
                    </div>`
                    )
                    .join("")}
                </div>
              </div>
              <div class="bg-white p-8 rounded-lg shadow-lg">
                <img src=${aboutPageImage} alt="About Us" class="w-full rounded-lg"/>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="py-20 bg-white">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-2 gap-12">
              <div>
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Contact Us</h2>
                <div class="space-y-4">
                  <div class="flex items-center">
                    <i class="fas fa-map-marker-alt text-primary w-6"></i>
                    <span class="ml-3">${content.contact?.address || ""}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-phone text-primary w-6"></i>
                    <span class="ml-3">${content.contact?.phone || ""}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-envelope text-primary w-6"></i>
                    <span class="ml-3">${content.contact?.email || ""}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-clock text-primary w-6"></i>
                    <span class="ml-3">${content.contact?.hours || ""}</span>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 p-8 rounded-lg">
                <form class="space-y-4">
                  <div>
                    <label class="block text-gray-700 mb-2">Name</label>
                    <input type="text" class="w-full px-4 py-2 rounded-lg border" placeholder="Your name">
                  </div>
                  <div>
                    <label class="block text-gray-700 mb-2">Email</label>
                    <input type="email" class="w-full px-4 py-2 rounded-lg border" placeholder="Your email">
                  </div>
                  <div>
                    <label class="block text-gray-700 mb-2">Message</label>
                    <textarea class="w-full px-4 py-2 rounded-lg border h-32" placeholder="Your message"></textarea>
                  </div>
                  <button type="submit" class="btn-primary w-full">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="bg-gray-900 text-white py-12">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid md:grid-cols-4 gap-8">
              <div>
                <h3 class="text-xl font-bold mb-4">${content.businessName}</h3>
                <p class="text-gray-400">${content.description}</p>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-4">Quick Links</h3>
                <ul class="space-y-2">
                ${navLinks
                  .map(
                    (link: string) =>
                      `<li><a href="#${link.toLowerCase()}" class="text-gray-400 hover:text-white transition-colors">${link}</a></li>`
                  )
                  .join("")}
                </ul>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-4">Services</h3>
                <ul class="space-y-2">
                  ${content.services
                    ?.slice(0, 4)
                    .map(
                      (service: { title: string }) =>
                        `<li><a href="#services" class="text-gray-400 hover:text-white transition-colors">${service.title}</a></li>`
                    )
                    .join("")}
                </ul>
              </div>
              <div>
                <h3 class="text-xl font-bold mb-4">Connect With Us</h3>
                <ul class="space-y-2">
                  ${footerLinks
                    .map(
                      (link: string) =>
                        `<li><a href="#" class="text-gray-400 hover:text-white transition-colors">${link}</a></li>`
                    )
                    .join("")}
                </ul>
              </div>
            </div>
            <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; ${new Date().getFullYear()} ${
    content.businessName
  }. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
      </body>
    </html>
  `;

  return websiteContent;
}
// API handler
export async function POST(request: Request) {
  try {
    const json = await request.json();
    const shopData = shopSchema.parse(json);

    // Add better error handling for each step
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
    console.error("API Error:", error); // Add detailed error logging
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
