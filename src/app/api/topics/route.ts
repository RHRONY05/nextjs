// GET /api/topics
// Fetches problems from Codeforces API filtered by topic and rating

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const CF_API_BASE = "https://codeforces.com/api";

// Common CP topics
const TOPICS = [
  "implementation",
  "math",
  "greedy",
  "dp",
  "data structures",
  "brute force",
  "constructive algorithms",
  "graphs",
  "sortings",
  "binary search",
  "dfs and similar",
  "trees",
  "strings",
  "number theory",
  "combinatorics",
  "geometry",
  "*special",
  "bitmasks",
  "two pointers",
  "dsu",
  "shortest paths",
  "probabilities",
  "divide and conquer",
  "hashing",
  "games",
  "flows",
  "interactive",
  "matrices",
  "string suffix structures",
  "fft",
  "graph matchings",
  "ternary search",
  "expression parsing",
  "meet-in-the-middle",
  "2-sat",
  "chinese remainder theorem",
  "schedules",
];

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: true, message: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const topic = searchParams.get("topic");
  const minRating = parseInt(searchParams.get("minRating") || "800");
  const maxRating = parseInt(searchParams.get("maxRating") || "1600");

  if (!topic) {
    // Return list of available topics
    return NextResponse.json({
      topics: TOPICS,
    });
  }

  try {
    // Fetch problemset from Codeforces
    const problemsetRes = await fetch(`${CF_API_BASE}/problemset.problems`);
    const problemsetData = await problemsetRes.json();

    if (problemsetData.status !== "OK") {
      return NextResponse.json(
        { error: true, message: "Failed to fetch problems", code: "CF_API_UNAVAILABLE" },
        { status: 503 },
      );
    }

    // Filter problems by topic and rating
    const filteredProblems = problemsetData.result.problems.filter((p: any) => {
      return (
        p.rating &&
        p.rating >= minRating &&
        p.rating <= maxRating &&
        p.tags &&
        p.tags.some((tag: string) => tag.toLowerCase() === topic.toLowerCase())
      );
    });

    // Sort by rating (ascending)
    filteredProblems.sort((a: any, b: any) => a.rating - b.rating);

    // Take first 50 problems
    const selectedProblems = filteredProblems.slice(0, 50).map((p: any) => ({
      contestId: p.contestId,
      problemIndex: p.index,
      problemName: p.name,
      problemUrl: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
      rating: p.rating,
      tags: p.tags,
    }));

    return NextResponse.json({
      topic,
      minRating,
      maxRating,
      problems: selectedProblems,
      count: selectedProblems.length,
    });
  } catch (error) {
    console.error("Topics API error:", error);
    return NextResponse.json(
      { error: true, message: "Failed to fetch problems", code: "INTERNAL_ERROR" },
      { status: 500 },
    );
  }
}
