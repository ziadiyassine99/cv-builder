import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const maxDuration = 120;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const variants = [
  "Using ALL the reference photos provided of this person, generate a professional corporate headshot. The face, features, and identity must be EXACTLY preserved — use the multiple angles to capture the real likeness. Apply: clean solid light gray background, soft professional studio lighting, classic dark navy business suit with white dress shirt and dark tie. Shoulders up, portrait framing.",
  "Using ALL the reference photos provided of this person, generate a professional corporate headshot. The face, features, and identity must be EXACTLY preserved — use the multiple angles to capture the real likeness. Apply: clean solid white background, bright natural studio lighting, modern charcoal gray blazer over a light blue shirt, no tie, smart casual professional look. Shoulders up, portrait framing.",
  "Using ALL the reference photos provided of this person, generate a professional corporate headshot. The face, features, and identity must be EXACTLY preserved — use the multiple angles to capture the real likeness. Apply: subtle soft gradient background from light gray to white, warm golden-hour style studio lighting, black suit jacket with crisp white open-collar shirt, elegant and approachable. Shoulders up, portrait framing.",
];

interface SourceImage {
  base64: string;
  mimeType: string;
}

function extractBase64(data: unknown): string {
  if (typeof data === "string") return data;
  if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    return Buffer.from(data).toString("base64");
  }
  return Buffer.from(data as ArrayBuffer).toString("base64");
}

async function generateOne(sources: SourceImage[], prompt: string) {
  const imageParts = sources.map((src) => ({
    inlineData: { mimeType: src.mimeType, data: src.base64 },
  }));

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: [
      {
        role: "user",
        parts: [
          ...imageParts,
          { text: prompt },
        ],
      },
    ],
    config: {
      responseModalities: ["Text", "Image"],
    },
  });

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) return null;

  for (const part of parts) {
    if (part.inlineData) {
      return {
        imageBase64: extractBase64(part.inlineData.data),
        mimeType: part.inlineData.mimeType || "image/png",
      };
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Support both single image (legacy) and multiple images
    let sources: SourceImage[];
    if (body.images && Array.isArray(body.images)) {
      sources = body.images;
    } else if (body.imageBase64) {
      sources = [{ base64: body.imageBase64, mimeType: body.mimeType || "image/jpeg" }];
    } else {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    if (sources.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const results = await Promise.allSettled(
      variants.map((prompt) => generateOne(sources, prompt))
    );

    const images = results
      .filter(
        (r): r is PromiseFulfilledResult<NonNullable<Awaited<ReturnType<typeof generateOne>>>> =>
          r.status === "fulfilled" && r.value !== null
      )
      .map((r) => r.value);

    if (images.length === 0) {
      const firstError = results.find((r) => r.status === "rejected") as PromiseRejectedResult | undefined;
      return NextResponse.json(
        { error: firstError?.reason?.message || "Failed to generate any headshot" },
        { status: 500 }
      );
    }

    return NextResponse.json({ images });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Headshot generation error:", errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 });
  }
}
