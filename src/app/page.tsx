"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, Store, Sparkles } from "lucide-react";
import { TextGenerateEffect } from "./components/ui/text-generate-effect";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-7xl py-20 sm:py-32">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left side content */}
            <div className="text-center lg:text-left lg:w-1/2">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                <TextGenerateEffect
                  words="Build Your Shop's Online Presence with AI"
                  duration={2}
                  className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
                />
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                Create a professional website for your local shop in minutes.
                Powered by AI, designed for success—all in one place.
              </p>
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
                <Link
                  href={user ? "/generate" : "/sign-up"}
                  className="rounded-md bg-[#18180E] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#52525B] transition-colors duration-300"
                >
                  Get started
                  <ArrowRight className="ml-2 inline-block h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              <div className="relative rounded-lg border border-[#52525B] bg-[#18180E]/50 p-4 backdrop-blur-sm">
                <div className="absolute -top-4 -left-4 bg-[#09090B] rounded-full p-2 border border-[#52525B]">
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KRk4PGPx5RS2pvzZYavQC8eLP7GpLK.png"
                  alt="AI Shop Builder Preview"
                  width={600}
                  height={400}
                  className="rounded-md shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#18180E]/30 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-500">
              Build Faster
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Everything you need to build your shop&apos;s website
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    {feature.icon}
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="border-t border-[#52525B] bg-[#09090B]">
        <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold leading-8 text-white">
              Trusted by Local Businesses Worldwide
            </h2>
            <div className="mt-8 flex items-center justify-center gap-x-8 sm:gap-x-12">
              {/* Add your trusted brand logos here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    name: "AI-Powered Design",
    description:
      "Let AI create the perfect design for your shop based on your preferences and industry.",
    icon: <Sparkles className="h-5 w-5 text-blue-500" />,
  },
  {
    name: "Easy Customization",
    description:
      "Customize every aspect of your website with our intuitive drag-and-drop interface.",
    icon: <Code className="h-5 w-5 text-blue-500" />,
  },
  {
    name: "Shop Management",
    description:
      "Manage your inventory, orders, and customer relationships all in one place.",
    icon: <Store className="h-5 w-5 text-blue-500" />,
  },
];
