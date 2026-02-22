"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Loader2, Sparkles, RotateCcw, Check, X, ZoomIn } from "lucide-react";

interface GeneratedImage {
  imageBase64: string;
  mimeType: string;
}

interface HeadshotGeneratorProps {
  onComplete: (photoUrl: string) => void;
  onSkip: () => void;
}

export function HeadshotGenerator({ onComplete, onSkip }: HeadshotGeneratorProps) {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const styleLabels = ["Classique", "Smart Casual", "Elegant"];

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSourceImage(reader.result as string);
      setGeneratedImages([]);
      setSelectedIndex(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleGenerate() {
    if (!sourceImage) return;
    setLoading(true);
    setError(null);
    setGeneratedImages([]);
    setSelectedIndex(null);

    try {
      const base64 = sourceImage.split(",")[1];
      const srcMime = sourceImage.split(";")[0].split(":")[1] || "image/jpeg";

      const res = await fetch("/api/ai/headshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64, mimeType: srcMime }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la generation");
        return;
      }

      setGeneratedImages(data.images);
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  function handleUse() {
    if (selectedIndex !== null && generatedImages[selectedIndex]) {
      const img = generatedImages[selectedIndex];
      onComplete(`data:${img.mimeType};base64,${img.imageBase64}`);
    }
  }

  const hasResults = generatedImages.length > 0;

  return (
    <div className="max-w-3xl mx-auto text-center space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Photo professionnelle</h2>
        <p className="text-muted-foreground">
          Uploadez une photo de vous et on genere 3 variantes pro
        </p>
      </div>

      {!sourceImage ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer"
        >
          <Camera className="w-10 h-10 text-slate-400" />
          <span className="text-sm text-slate-500">Choisir une photo</span>
        </button>
      ) : (
        <div className="space-y-6">
          {/* Source image */}
          <div className="flex justify-center">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Originale
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={sourceImage}
                alt="Original"
                className="w-32 h-32 rounded-2xl object-cover border"
              />
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center gap-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {styleLabels[i]}
                  </p>
                  <div className="w-40 h-48 rounded-2xl border bg-slate-50 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" style={{ animationDelay: `${i * 200}ms` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generated images grid */}
          {hasResults && !loading && (
            <div className="flex items-center justify-center gap-5">
              {generatedImages.map((img, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    {styleLabels[i] || `Option ${i + 1}`}
                  </p>
                  <div className="relative group">
                    {/* Select on click */}
                    <button
                      type="button"
                      onClick={() => setSelectedIndex(i)}
                      className={`block cursor-pointer transition-all ${
                        selectedIndex === i ? "scale-105" : "hover:scale-[1.02]"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`data:${img.mimeType};base64,${img.imageBase64}`}
                        alt={styleLabels[i]}
                        className={`w-40 h-48 rounded-2xl object-cover transition-all ${
                          selectedIndex === i
                            ? "border-3 border-primary ring-4 ring-primary/20"
                            : "border border-slate-200 group-hover:border-slate-400"
                        }`}
                      />
                    </button>
                    {/* Zoom button */}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                      className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-lg p-1.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                  {selectedIndex === i && (
                    <div className="flex items-center justify-center gap-1 text-primary text-xs font-medium">
                      <Check className="w-3.5 h-3.5" />
                      Selectionne
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Lightbox modal */}
          {lightboxIndex !== null && generatedImages[lightboxIndex] && (
            <div
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8"
              onClick={() => setLightboxIndex(null)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setLightboxIndex(null);
                if (e.key === "ArrowRight" && lightboxIndex < generatedImages.length - 1) setLightboxIndex(lightboxIndex + 1);
                if (e.key === "ArrowLeft" && lightboxIndex > 0) setLightboxIndex(lightboxIndex - 1);
              }}
              role="dialog"
              tabIndex={0}
            >
              <div className="relative max-w-2xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="absolute -top-10 right-0 text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
                <p className="text-white text-center text-sm font-medium mb-3">
                  {styleLabels[lightboxIndex]} — {lightboxIndex + 1}/{generatedImages.length}
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`data:${generatedImages[lightboxIndex].mimeType};base64,${generatedImages[lightboxIndex].imageBase64}`}
                  alt={styleLabels[lightboxIndex]}
                  className="max-h-[75vh] w-auto rounded-2xl shadow-2xl"
                />
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={lightboxIndex === 0}
                    onClick={() => setLightboxIndex(lightboxIndex - 1)}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Precedent
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => { setSelectedIndex(lightboxIndex); setLightboxIndex(null); }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Choisir celle-ci
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={lightboxIndex === generatedImages.length - 1}
                    onClick={() => setLightboxIndex(lightboxIndex + 1)}
                    className="text-white border-white/30 hover:bg-white/10"
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center justify-center gap-3">
        {sourceImage && !hasResults && !loading && (
          <>
            <Button variant="outline" onClick={() => { setSourceImage(null); setGeneratedImages([]); setSelectedIndex(null); }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Changer de photo
            </Button>
            <Button onClick={handleGenerate}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generer les headshots
            </Button>
          </>
        )}

        {hasResults && !loading && (
          <>
            <Button variant="outline" onClick={() => { setSourceImage(null); setGeneratedImages([]); setSelectedIndex(null); }}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Changer de photo
            </Button>
            <Button variant="outline" onClick={handleGenerate}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Regenerer
            </Button>
            <Button
              onClick={handleUse}
              disabled={selectedIndex === null}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Check className="w-4 h-4 mr-2" />
              Utiliser cette photo
            </Button>
          </>
        )}

        <Button variant="ghost" onClick={onSkip} className="text-muted-foreground">
          Passer cette etape
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
