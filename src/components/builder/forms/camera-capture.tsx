"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, RotateCcw, ArrowRight, Check } from "lucide-react";

interface CameraCaptureProps {
  onComplete: (photos: string[]) => void;
  onCancel: () => void;
}

const STEPS = [
  {
    label: "De face",
    instruction: "Regardez la camera bien de face",
    guide: "Centrez votre visage dans le cercle",
  },
  {
    label: "De cote",
    instruction: "Tournez legerement la tete vers la droite",
    guide: "Un leger profil, pas completement de cote",
  },
];

export function CameraCapture({ onComplete, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [cameraReady, setCameraReady] = useState(false);

  const startCamera = useCallback(async (facing: "user" | "environment") => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode, startCamera]);

  function takePhoto() {
    setCountdown(3);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      captureFrame();
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  function captureFrame() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const newPhotos = [...photos, dataUrl];
    setPhotos(newPhotos);

    if (newPhotos.length < STEPS.length) {
      setStep(step + 1);
    }
  }

  function retakePhoto() {
    setPhotos(photos.slice(0, -1));
    if (step > 0 && photos.length <= step) {
      setStep(step - 1);
    }
  }

  function handleDone() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onComplete(photos);
  }

  function handleCancel() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCancel();
  }

  const currentStep = STEPS[step];
  const allDone = photos.length >= STEPS.length;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col" role="dialog">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/80">
        <button type="button" onClick={handleCancel} className="text-white/70 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-white text-sm font-medium">{currentStep?.label || "Termine"}</p>
          <p className="text-white/50 text-xs">Photo {Math.min(photos.length + 1, STEPS.length)}/{STEPS.length}</p>
        </div>
        <button
          type="button"
          onClick={() => setFacingMode(facingMode === "user" ? "environment" : "user")}
          className="text-white/70 hover:text-white"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative overflow-hidden bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`h-full w-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Face guide overlay */}
        {!allDone && cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-72 border-2 border-white/40 rounded-[50%]" />
          </div>
        )}

        {/* Countdown */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="text-white text-8xl font-bold animate-pulse">{countdown}</span>
          </div>
        )}

        {/* Instruction */}
        {!allDone && cameraReady && countdown === null && (
          <div className="absolute bottom-24 left-0 right-0 text-center">
            <p className="text-white text-sm bg-black/50 inline-block px-4 py-2 rounded-full">
              {currentStep?.instruction}
            </p>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-black/80 px-4 py-5">
        {/* Thumbnails */}
        {photos.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-4">
            {photos.map((photo, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={STEPS[i]?.label} className="w-14 h-14 rounded-lg object-cover border-2 border-white/30" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-medium">
                  {STEPS[i]?.label}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-6">
          {!allDone ? (
            <>
              {photos.length > 0 && (
                <Button variant="ghost" size="sm" onClick={retakePhoto} className="text-white/60 hover:text-white">
                  <RotateCcw className="w-4 h-4 mr-1.5" />
                  Reprendre
                </Button>
              )}
              <button
                type="button"
                onClick={takePhoto}
                disabled={!cameraReady || countdown !== null}
                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <Camera className="w-7 h-7 text-white" />
              </button>
              <div className="w-20" />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={retakePhoto} className="text-white/60 hover:text-white">
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Reprendre
              </Button>
              <Button onClick={handleDone} className="bg-green-600 hover:bg-green-700">
                <Check className="w-4 h-4 mr-1.5" />
                Utiliser ces photos
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
