"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useResumeStore } from "@/store/resume-store";
import { Button } from "@/components/ui/button";
import { AudioVisualizer } from "./audio-visualizer";
import { Mic, MicOff, PhoneOff, Loader2, User, Mail, Briefcase, GraduationCap, Wrench, Globe, Heart, FileText, CheckCircle2 } from "lucide-react";

interface VoiceSessionProps {
  onComplete: () => void;
}

interface TranscriptEntry {
  role: "ai" | "user";
  text: string;
}

const STEPS = [
  { id: "identity", label: "Identite", icon: User },
  { id: "contact", label: "Coordonnees", icon: Mail },
  { id: "experience", label: "Experiences", icon: Briefcase },
  { id: "education", label: "Formation", icon: GraduationCap },
  { id: "skills", label: "Competences", icon: Wrench },
  { id: "languages", label: "Langues", icon: Globe },
  { id: "interests", label: "Interets", icon: Heart },
  { id: "profile", label: "Resume pro", icon: FileText },
] as const;

type StepId = (typeof STEPS)[number]["id"] | "done";

export function VoiceSession({ onComplete }: VoiceSessionProps) {
  const [status, setStatus] = useState<"idle" | "connecting" | "connected" | "ended">("idle");
  const [muted, setMuted] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepId>("identity");

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const store = useResumeStore;

  const handleFunctionCall = useCallback(
    (name: string, args: Record<string, unknown>) => {
      const state = store.getState();

      switch (name) {
        case "setCurrentStep":
          if (args.step) setCurrentStep(args.step as StepId);
          break;
        case "updatePersonalInfo":
          state.updatePersonalInfo(args as Record<string, string>);
          break;
        case "setProfile":
          state.setProfile((args.text as string) || "");
          break;
        case "addExperience": {
          state.addExperience();
          const exps = store.getState().resume.experience;
          const lastExp = exps[exps.length - 1];
          if (lastExp) {
            state.updateExperience(lastExp.id, {
              position: (args.position as string) || "",
              company: (args.company as string) || "",
              city: (args.city as string) || "",
              startDate: (args.startDate as string) || "",
              endDate: (args.endDate as string) || "",
              current: (args.current as boolean) || false,
              description: (args.description as string) || "",
            });
          }
          break;
        }
        case "addEducation": {
          state.addEducation();
          const edus = store.getState().resume.education;
          const lastEdu = edus[edus.length - 1];
          if (lastEdu) {
            state.updateEducation(lastEdu.id, {
              degree: (args.degree as string) || "",
              school: (args.school as string) || "",
              city: (args.city as string) || "",
              startDate: (args.startDate as string) || "",
              endDate: (args.endDate as string) || "",
              current: (args.current as boolean) || false,
              description: (args.description as string) || "",
            });
          }
          break;
        }
        case "addSkill":
          store.getState().addSkill();
          {
            const skills = store.getState().resume.skills;
            const last = skills[skills.length - 1];
            if (last) {
              store.getState().updateSkill(last.id, {
                name: (args.name as string) || "",
                level: (args.level as number) || 3,
              });
            }
          }
          break;
        case "addLanguage":
          store.getState().addLanguage();
          {
            const langs = store.getState().resume.languages;
            const last = langs[langs.length - 1];
            if (last) {
              store.getState().updateLanguage(last.id, {
                name: (args.name as string) || "",
                level: (args.level as string) || "Intermediaire",
              });
            }
          }
          break;
        case "addInterest":
          store.getState().addInterest();
          {
            const interests = store.getState().resume.interests;
            const last = interests[interests.length - 1];
            if (last) {
              store.getState().updateInterest(last.id, {
                name: (args.name as string) || "",
              });
            }
          }
          break;
      }
    },
    [store]
  );

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const startSession = useCallback(async () => {
    setStatus("connecting");

    try {
      const tokenRes = await fetch("/api/ai/session", { method: "POST" });
      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        console.error("Session error:", tokenData);
        setStatus("idle");
        return;
      }

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioEl = document.createElement("audio");
      audioEl.autoplay = true;
      audioRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
        setAiSpeaking(true);
      };

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      const pendingCalls: Record<string, { name: string; args: string }> = {};

      dc.onmessage = (e) => {
        const event = JSON.parse(e.data);

        if (event.type === "response.audio_transcript.delta") {
          setAiSpeaking(true);
        }

        if (event.type === "response.audio_transcript.done") {
          setAiSpeaking(false);
          if (event.transcript) {
            setTranscript((prev) => [...prev, { role: "ai", text: event.transcript }]);
          }
        }

        if (event.type === "conversation.item.input_audio_transcription.completed") {
          if (event.transcript) {
            setTranscript((prev) => [...prev, { role: "user", text: event.transcript }]);
          }
        }

        if (event.type === "response.function_call_arguments.delta") {
          const callId = event.call_id;
          if (!pendingCalls[callId]) {
            pendingCalls[callId] = { name: event.name || "", args: "" };
          }
          if (event.name) pendingCalls[callId].name = event.name;
          pendingCalls[callId].args += event.delta || "";
        }

        if (event.type === "response.function_call_arguments.done") {
          const callId = event.call_id;
          const call = pendingCalls[callId] || { name: event.name, args: event.arguments };
          try {
            const args = JSON.parse(call.args || event.arguments || "{}");
            handleFunctionCall(call.name || event.name, args);
          } catch (err) {
            console.error("Failed to parse function args:", err);
          }

          dc.send(
            JSON.stringify({
              type: "conversation.item.create",
              item: {
                type: "function_call_output",
                call_id: callId,
                output: JSON.stringify({ success: true }),
              },
            })
          );
          dc.send(JSON.stringify({ type: "response.create" }));
          delete pendingCalls[callId];
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-realtime",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenData.client_secret.value}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      const answer = {
        type: "answer" as RTCSdpType,
        sdp: await sdpRes.text(),
      };
      await pc.setRemoteDescription(answer);

      setStatus("connected");
    } catch (err) {
      console.error("Connection error:", err);
      setStatus("idle");
    }
  }, [handleFunctionCall]);

  function toggleMute() {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
      setMuted(!muted);
    }
  }

  function endSession() {
    pcRef.current?.close();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioRef.current?.remove();
    setStatus("ended");
    onComplete();
  }

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const isDone = currentStep === "done";

  return (
    <div className="space-y-6">
      {/* Stepper */}
      {status === "connected" && (
        <div className="bg-white rounded-xl border p-4">
          <div className="flex items-center gap-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = isDone || i < currentStepIndex;

              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-primary text-white ring-4 ring-primary/20"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] mt-1 text-center leading-tight truncate w-full ${
                        isActive ? "font-bold text-primary" : isCompleted ? "text-green-600" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-4 shrink-0 mx-0.5 ${
                        isCompleted ? "bg-green-400" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main voice area */}
      <div className="text-center space-y-5">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {status === "idle" && "Parlez-moi de vous"}
            {status === "connecting" && "Connexion..."}
            {status === "connected" && !isDone && (
              STEPS[currentStepIndex]?.label || "Conversation"
            )}
            {isDone && "CV termine !"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {status === "idle" && "Cliquez sur le micro pour commencer"}
            {status === "connecting" && "Preparation de la session vocale..."}
            {status === "connected" && !isDone && "Repondez aux questions — votre CV se remplit en direct"}
            {isDone && "Vous pouvez maintenant finaliser dans l'editeur"}
          </p>
        </div>

        {/* Visualizer */}
        <div className="flex justify-center py-2">
          <AudioVisualizer isActive={status === "connected" && aiSpeaking} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {status === "idle" && (
            <Button size="lg" onClick={startSession} className="rounded-full h-16 w-16 p-0 shadow-lg hover:shadow-xl transition-shadow">
              <Mic className="w-7 h-7" />
            </Button>
          )}

          {status === "connecting" && (
            <Button size="lg" disabled className="rounded-full h-16 w-16 p-0">
              <Loader2 className="w-7 h-7 animate-spin" />
            </Button>
          )}

          {status === "connected" && (
            <>
              <Button
                size="lg"
                variant={muted ? "destructive" : "outline"}
                onClick={toggleMute}
                className="rounded-full h-14 w-14 p-0"
              >
                {muted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              <Button
                size="lg"
                variant="destructive"
                onClick={endSession}
                className="rounded-full h-14 w-14 p-0"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Transcript */}
      {transcript.length > 0 && (
        <div className="bg-white rounded-xl border p-4 max-h-48 overflow-y-auto space-y-2.5">
          {transcript.map((entry, i) => (
            <div
              key={`${entry.role}-${i}`}
              className={`flex gap-2 text-sm ${
                entry.role === "ai" ? "text-slate-600" : ""
              }`}
            >
              <span
                className={`text-[10px] font-bold uppercase tracking-wider mt-0.5 shrink-0 w-8 ${
                  entry.role === "ai" ? "text-cyan-600" : "text-primary"
                }`}
              >
                {entry.role === "ai" ? "IA" : "Vous"}
              </span>
              <span className={entry.role === "user" ? "font-medium" : ""}>
                {entry.text}
              </span>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      )}
    </div>
  );
}
