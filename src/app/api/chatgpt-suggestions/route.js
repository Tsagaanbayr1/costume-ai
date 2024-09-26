import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

export async function POST(req) {
  const { features } = await req.json(); // Parse JSON from request body

  const prompt = `Suggest characters based on these physical features: ${features}`;

  const response = await openai.createCompletion({
    model: "gpt-4",
    prompt,
    max_tokens: 100,
  });

  const characterSuggestions = response.data.choices[0].text;

  return NextResponse.json({ suggestions: characterSuggestions });
}
