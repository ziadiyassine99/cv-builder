import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { requireAuth } from "@/lib/api-auth";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export const maxDuration = 120;

function getAI() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
}

const MAX_IMAGES = 5;
const MAX_BASE64_LENGTH = 5 * 1024 * 1024; // ~3.75MB decoded (base64 is ~33% larger)
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

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
  if (data instanceof Uint8Array) {
    return Buffer.from(data).toString("base64");
  }
  if (data instanceof ArrayBuffer) {
    return Buffer.from(new Uint8Array(data)).toString("base64");
  }
  return Buffer.from(new Uint8Array(data as ArrayBuffer)).toString("base64");
}

function validateImages(sources: SourceImage[]): string | null {
  if (sources.length === 0) return "No images provided";
  if (sources.length > MAX_IMAGES) return `Maximum ${MAX_IMAGES} images allowed`;

  for (const src of sources) {
    if (!ALLOWED_MIME_TYPES.has(src.mimeType)) {
      return `Invalid image type: ${src.mimeType}`;
    }
    if (typeof src.base64 !== "string" || src.base64.length > MAX_BASE64_LENGTH) {
      return "Image too large (max 5MB)";
    }
    if (src.base64.length === 0) {
      return "Empty image data";
    }
  }

  return null;
}

async function generateOne(sources: SourceImage[], prompt: string) {
  const imageParts = sources.map((src) => ({
    inlineData: { mimeType: src.mimeType, data: src.base64 },
  }));

  const response = await getAI().models.generateContent({
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
    const auth = await requireAuth();
    if (auth.error) return auth.error;

    const rateLimitError = rateLimit(auth.user.id, "headshot", RATE_LIMITS.headshot);
    if (rateLimitError) return rateLimitError;

    const body = await req.json();

    let sources: SourceImage[];
    if (body.images && Array.isArray(body.images)) {
      sources = body.images;
    } else if (body.imageBase64) {
      sources = [{ base64: body.imageBase64, mimeType: body.mimeType || "image/jpeg" }];
    } else {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    const validationError = validateImages(sources);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
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
      return NextResponse.json(
        { error: "Failed to generate headshots. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
