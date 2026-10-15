"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StoryReader } from "@/components/stories/StoryReader";
import { getStoryBySlug } from "@/lib/content/stories";
import type { Story } from "@/types/stories";

interface StoryReaderPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}

export default function StoryReaderPage({
  params,
  searchParams,
}: StoryReaderPageProps) {
  const { slug } = use(params);
  const resolvedSearchParams = use(searchParams || Promise.resolve({})) as Record<string, string | undefined>;
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Get initial page number from URL query param or default to 1
  const initialPageNumber = Math.max(
    1,
    parseInt(resolvedSearchParams?.page ?? "1") || 1
  );

  useEffect(() => {
    const foundStory = getStoryBySlug(slug);

    if (!foundStory) {
      setError(`Story "${slug}" not found`);
      return;
    }

    if (!foundStory.pages || foundStory.pages.length === 0) {
      setError(`Story "${slug}" has no pages`);
      return;
    }

    setStory(foundStory);
  }, [slug]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12 max-w-2xl mx-auto">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <h1 className="font-extrabold text-stone-800 text-2xl mb-2">
            Story Not Found
          </h1>
          <p className="text-stone-600 mb-6">{error}</p>
        </div>

        <Link
          href="/stories"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-2xl transition"
        >
          ← Back to Stories
        </Link>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-12">
        <div className="text-4xl">📚</div>
        <p className="text-stone-600 font-semibold">Loading story...</p>
      </div>
    );
  }

  return <StoryReader story={story} initialPageNumber={initialPageNumber} />;
}
