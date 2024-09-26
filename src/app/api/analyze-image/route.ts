import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";
import { OpenAI } from "openai";

const client = new vision.ImageAnnotatorClient({
  keyFilename: "path-to-your-service-account-key-file.json",
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const imageFile = formData.get("image") as File;
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const [result] = await client.faceDetection(buffer);
  const faces = result.faceAnnotations;

  const prompt = `Suggest a costume based on these physical features: ${faces}`;
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const keyword = response.choices[0].message.content?.trim();

  const unsplashResponse = await fetch(
    `https://api.unsplash.com/search/photos?query=${keyword}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
  );

  const unsplashData = await unsplashResponse.json();
  const imageUrl = unsplashData.results.length
    ? unsplashData.results[0].urls.small
    : null;

  return NextResponse.json({ imageUrl });
}
