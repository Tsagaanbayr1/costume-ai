/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UploadIcon,
  CameraIcon,
  RefreshCwIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";

const MAX_ANALYSES = 5;

const initialSuggestedCostumes = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1603195827187-d2296874aac5?w=300&h=400&fit=crop",
    description: "Superhero Costume",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=400&fit=crop",
    description: "Pirate Costume",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1572988163424-e1b29b4a7b17?w=300&h=400&fit=crop",
    description: "Witch Costume",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1604609165678-094d25c83f66?w=300&h=400&fit=crop",
    description: "Astronaut Costume",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=300&h=400&fit=crop",
    description: "Dinosaur Costume",
  },
];

const existingCostumeExamples = [
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1603195827187-d2296874aac5?w=300&h=400&fit=crop",
    description: "Vampire Costume",
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&h=400&fit=crop",
    description: "Zombie Costume",
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1572988163424-e1b29b4a7b17?w=300&h=400&fit=crop",
    description: "Fairy Costume",
  },
];

export default function AICostumeMatchmaker() {
  const [image, setImage] = useState<string | null>(null);
  const [purpose, setPurpose] = useState<string>("");
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [suggestedCostumes, setSuggestedCostumes] = useState<
    typeof initialSuggestedCostumes
  >([]);
  const [likedCostumes, setLikedCostumes] = useState<
    typeof initialSuggestedCostumes
  >([]);

  const [loading, setLoading] = useState(false);
  const [remainingAnalyses, setRemainingAnalyses] = useState(MAX_ANALYSES);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (remainingAnalyses > 0) {
      setLoading(true);
      // Simulating API calls
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setAnalysis(`Analysis based on the image and purpose: ${purpose}`);
      setSuggestedCostumes(initialSuggestedCostumes.slice(0, 3)); // Suggest 3 random costumes
      setRemainingAnalyses((prev) => prev - 1);
      setLoading(false);
    }
  };

  const handleLike = (costume: (typeof initialSuggestedCostumes)[0]) => {
    setLikedCostumes((prev) => [...prev, costume]);
    setSuggestedCostumes((prev) => prev.filter((c) => c.id !== costume.id));
  };

  const handleDislike = (costumeId: number) => {
    setSuggestedCostumes((prev) => prev.filter((c) => c.id !== costumeId));
  };

  const handleRemoveLiked = (costumeId: number) => {
    setLikedCostumes((prev) => prev.filter((c) => c.id !== costumeId));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4 space-y-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            AI Costume Matchmaker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="w-64 h-48 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                {image ? (
                  <Image
                    src={image}
                    alt="Uploaded"
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                ) : (
                  <CameraIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <UploadIcon className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Costume Purpose (Optional)</Label>
            <Input
              id="purpose"
              placeholder="E.g., Halloween, Cosplay Contest, Theme Party"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>
          <Button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 active:bg-blue-700 disabled:opacity-50"
            onClick={handleAnalyze}
            disabled={loading || !image || remainingAnalyses === 0}
          >
            {loading ? (
              <>
                <RefreshCwIcon className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              `Analyze and Suggest Costumes (${remainingAnalyses} left)`
            )}
          </Button>
          {analysis && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Analysis:</h3>
              <p>{analysis}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {suggestedCostumes.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Suggested Costumes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestedCostumes.map((costume) => (
              <Card key={costume.id}>
                <CardContent className="p-4">
                  <img
                    src={costume.image}
                    alt={costume.description}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-center font-semibold">
                    {costume.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => handleLike(costume)}>
                    <ThumbsUpIcon className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDislike(costume.id)}
                  >
                    <ThumbsDownIcon className="w-4 h-4 mr-2" />
                    Dislike
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {likedCostumes.length > 0 && (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Liked Costumes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {likedCostumes.map((costume) => (
              <Card key={costume.id}>
                <CardContent className="p-4">
                  <img
                    src={costume.image}
                    alt={costume.description}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <p className="text-center font-semibold">
                    {costume.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleRemoveLiked(costume.id)}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Existing Costume Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {existingCostumeExamples.map((costume) => (
            <Card key={costume.id}>
              <CardContent className="p-4">
                <img
                  src={costume.image}
                  alt={costume.description}
                  className="w-full h-48 object-cover rounded-lg mb-2"
                />
                <p className="text-center font-semibold">
                  {costume.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
