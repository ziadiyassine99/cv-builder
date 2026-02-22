"use client";

import { useRef, useState, useCallback } from "react";
import { useResumeStore } from "@/store/resume-store";
import { createClient } from "@/lib/supabase/client";
import { getCroppedImg } from "@/lib/crop-image";
import { Button } from "@/components/ui/button";
import { Camera, X, Loader2, Sparkles, RotateCcw, Check, ZoomIn, Plus, Crop, Video } from "lucide-react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { CameraCapture } from "./camera-capture";

interface GeneratedImage {
  imageBase64: string;
  mimeType: string;
}

const styleLabels = ["Classique", "Smart Casual", "Elegant"];

export function PhotoUpload() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const supabase = createClient();

  // Manual upload + crop state
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Headshot generator state
  const [showGenerator, setShowGenerator] = useState(false);
  const [sourceImages, setSourceImages] = useState<string[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const genInputRef = useRef<HTMLInputElement>(null);

  // --- Manual upload with crop ---
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Max 5 Mo"); return; }
    if (!file.type.startsWith("image/")) { toast.error("Image uniquement"); return; }
    const reader = new FileReader();
    reader.onload = () => setCropSource(reader.result as string);
    reader.readAsDataURL(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  async function handleCropConfirm() {
    if (!cropSource || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedDataUrl = await getCroppedImg(cropSource, croppedAreaPixels);

      const blob = await fetch(croppedDataUrl).then((r) => r.blob());
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
      const filePath = `photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("cv-assets")
        .upload(filePath, blob, { contentType: "image/jpeg", upsert: true });

      if (uploadError) {
        toast.error(`Erreur upload : ${uploadError.message}`);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("cv-assets").getPublicUrl(filePath);
      updatePersonalInfo({ photo: publicUrl });
      toast.success("Photo mise a jour !");
      setCropSource(null);
    } catch {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  }

  function handleRemove() {
    updatePersonalInfo({ photo: "" });
  }

  // --- Headshot generator ---
  function handleGenFilesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const remaining = 3 - sourceImages.length;
    const toAdd = files.slice(0, remaining);

    toAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setSourceImages((prev) => {
          if (prev.length >= 3) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });
    if (genInputRef.current) genInputRef.current.value = "";
    setGeneratedImages([]);
    setSelectedIndex(null);
    setGenError(null);
  }

  function removeSourceImage(idx: number) {
    setSourceImages((prev) => prev.filter((_, i) => i !== idx));
    setGeneratedImages([]);
    setSelectedIndex(null);
  }

  async function handleGenerate() {
    if (sourceImages.length === 0) return;
    setGenerating(true);
    setGenError(null);
    setGeneratedImages([]);
    setSelectedIndex(null);

    try {
      const images = sourceImages.map((src) => ({
        base64: src.split(",")[1],
        mimeType: src.split(";")[0].split(":")[1] || "image/jpeg",
      }));

      const res = await fetch("/api/ai/headshot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });

      const data = await res.json();
      if (!res.ok) { setGenError(data.error || "Erreur"); return; }
      setGeneratedImages(data.images);
    } catch {
      setGenError("Erreur de connexion");
    } finally {
      setGenerating(false);
    }
  }

  function handleUseGenerated() {
    if (selectedIndex !== null && generatedImages[selectedIndex]) {
      const img = generatedImages[selectedIndex];
      updatePersonalInfo({ photo: `data:${img.mimeType};base64,${img.imageBase64}` });
      toast.success("Headshot pro applique !");
      setShowGenerator(false);
      setSourceImages([]);
      setGeneratedImages([]);
      setSelectedIndex(null);
    }
  }

  return (
    <div className="space-y-3">
      {/* Current photo + buttons */}
      <div className="flex items-center gap-4">
        {resume.personalInfo.photo ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resume.personalInfo.photo} alt="Photo" className="w-16 h-16 rounded-full object-cover border-2 border-slate-200" />
            <button type="button" onClick={handleRemove} className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center hover:bg-destructive/90">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
            <Camera className="w-6 h-6 text-slate-400" />
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
              <Camera className="w-4 h-4 mr-1.5" />
              {resume.personalInfo.photo ? "Changer" : "Ajouter photo"}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowGenerator(!showGenerator)} className="text-primary border-primary/30 hover:bg-primary/5">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Headshot Pro
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground">JPG, PNG. Max 5 Mo. Le crop s&apos;ouvre apres upload.</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
      </div>

      {/* Crop modal */}
      {cropSource && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" role="dialog">
          <div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <p className="font-semibold text-sm flex items-center gap-2"><Crop className="w-4 h-4" /> Recadrer votre photo</p>
              <button type="button" onClick={() => setCropSource(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="relative w-full h-80 bg-slate-900">
              <Cropper
                image={cropSource}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="px-4 py-2 border-t">
              <label className="text-xs text-muted-foreground">Zoom</label>
              <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="px-4 py-3 border-t flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setCropSource(null)}>Annuler</Button>
              <Button size="sm" onClick={handleCropConfirm} disabled={uploading}>
                {uploading ? <><Loader2 className="w-4 h-4 mr-1.5 animate-spin" />Upload...</> : <><Check className="w-4 h-4 mr-1.5" />Appliquer</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Headshot generator panel */}
      {showGenerator && (
        <div className="border rounded-xl p-4 bg-gradient-to-br from-slate-50 to-cyan-50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Generateur de headshot pro
              </p>
              <p className="text-xs text-muted-foreground">Uploadez 1 a 3 photos pour de meilleurs resultats</p>
            </div>
            <button type="button" onClick={() => { setShowGenerator(false); setSourceImages([]); setGeneratedImages([]); }} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Source images */}
          <div className="flex items-center gap-3 flex-wrap">
            {sourceImages.map((src, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Source ${i + 1}`} className="w-20 h-20 rounded-xl object-cover border" />
                <button
                  type="button"
                  onClick={() => removeSourceImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-md">{i + 1}/{sourceImages.length}</span>
              </div>
            ))}

            {sourceImages.length < 3 && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => genInputRef.current?.click()}
                  className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-slate-400" />
                  <span className="text-[9px] text-slate-400">Fichier</span>
                </button>
              </div>
            )}

            {sourceImages.length === 0 && (
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Video className="w-5 h-5 text-primary/60" />
                <span className="text-[9px] text-primary/60">Camera</span>
              </button>
            )}
          </div>

          {sourceImages.length > 0 && (
            <p className="text-[10px] text-muted-foreground">
              {sourceImages.length}/3 photos — {sourceImages.length >= 2 ? "bonne base pour la generation" : "ajoutez plus de photos pour un meilleur resultat"}
            </p>
          )}

          {/* Generate button */}
          {sourceImages.length > 0 && generatedImages.length === 0 && !generating && (
            <Button size="sm" onClick={handleGenerate}>
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Generer les headshots
            </Button>
          )}

          {/* Loading */}
          {generating && (
            <div className="flex items-center justify-center gap-4 py-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="text-center space-y-1.5">
                  <div className="w-24 h-28 rounded-xl border bg-white flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" style={{ animationDelay: `${i * 200}ms` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{styleLabels[i]}</p>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {generatedImages.length > 0 && !generating && (
            <>
              <div className="flex items-center justify-center gap-3">
                {generatedImages.map((img, i) => (
                  <div key={i} className="text-center space-y-1.5">
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(i)}
                        className={`block cursor-pointer transition-all ${selectedIndex === i ? "scale-105" : "hover:scale-[1.02]"}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:${img.mimeType};base64,${img.imageBase64}`}
                          alt={styleLabels[i]}
                          className={`w-24 h-28 rounded-xl object-cover transition-all ${
                            selectedIndex === i ? "border-2 border-primary ring-3 ring-primary/20" : "border border-slate-200 group-hover:border-slate-400"
                          }`}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                        className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <ZoomIn className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{styleLabels[i]}</p>
                    {selectedIndex === i && (
                      <p className="text-[10px] text-primary font-medium flex items-center justify-center gap-0.5"><Check className="w-3 h-3" /> Choisi</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button size="sm" variant="outline" onClick={handleGenerate}>
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Regenerer
                </Button>
                <Button size="sm" onClick={handleUseGenerated} disabled={selectedIndex === null} className="bg-green-600 hover:bg-green-700 disabled:opacity-50">
                  <Check className="w-3.5 h-3.5 mr-1" /> Appliquer
                </Button>
              </div>
            </>
          )}

          {genError && <p className="text-xs text-destructive">{genError}</p>}
          <input ref={genInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGenFilesSelect} />
        </div>
      )}

      {/* Lightbox */}
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
          <div className="relative max-w-xl" onClick={(e) => e.stopPropagation()}>
            <button type="button" onClick={() => setLightboxIndex(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white cursor-pointer"><X className="w-6 h-6" /></button>
            <p className="text-white text-center text-sm font-medium mb-3">{styleLabels[lightboxIndex]} — {lightboxIndex + 1}/{generatedImages.length}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`data:${generatedImages[lightboxIndex].mimeType};base64,${generatedImages[lightboxIndex].imageBase64}`} alt={styleLabels[lightboxIndex]} className="max-h-[75vh] w-auto rounded-2xl shadow-2xl mx-auto" />
            <div className="flex items-center justify-center gap-3 mt-4">
              <Button variant="outline" size="sm" disabled={lightboxIndex === 0} onClick={() => setLightboxIndex(lightboxIndex - 1)} className="text-white border-white/30 hover:bg-white/10">Precedent</Button>
              <Button size="sm" onClick={() => { setSelectedIndex(lightboxIndex); setLightboxIndex(null); }} className="bg-green-600 hover:bg-green-700"><Check className="w-4 h-4 mr-1" />Choisir</Button>
              <Button variant="outline" size="sm" disabled={lightboxIndex === generatedImages.length - 1} onClick={() => setLightboxIndex(lightboxIndex + 1)} className="text-white border-white/30 hover:bg-white/10">Suivant</Button>
            </div>
          </div>
        </div>
      )}

      {/* Camera capture */}
      {showCamera && (
        <CameraCapture
          onComplete={(capturedPhotos) => {
            setSourceImages(capturedPhotos.slice(0, 3));
            setShowCamera(false);
            setGeneratedImages([]);
            setSelectedIndex(null);
          }}
          onCancel={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
