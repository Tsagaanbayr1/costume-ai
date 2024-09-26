import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { characterName } = await req.json(); // Parse JSON from request body

  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${characterName}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );

  const data = await response.json();
  const imageUrl = data.results.length ? data.results[0].urls.small : null;

  return NextResponse.json({ imageUrl });
}
