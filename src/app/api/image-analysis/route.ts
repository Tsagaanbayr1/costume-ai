import { NextResponse } from "next/server";
import vision from "@google-cloud/vision";

const client = new vision.ImageAnnotatorClient({
  keyFilename: "path-to-your-service-account-key-file.json", // If you're using a service account
});

export async function POST(req: Request) {
  const { imageUrl } = await req.json(); // Parse JSON from request body

  const [result] = await client.faceDetection(imageUrl);
  const faces = result.faceAnnotations;

  return NextResponse.json({ features: faces });
}
