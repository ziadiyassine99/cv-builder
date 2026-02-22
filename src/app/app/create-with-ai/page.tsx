"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/store/resume-store";
import { createBrowserClient } from "@supabase/ssr";
import { HeadshotGenerator } from "@/components/ai/headshot-generator";
import { VoiceSession } from "@/components/ai/voice-session";
import { ResumePreview } from "@/components/builder/resume-preview";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Check } from "lucide-react";

type Step = "headshot" | "conversation" | "review";

export default function CreateWithAIPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("headshot");
  const [saving, setSaving] = useState(false);
  const { resume, updatePersonalInfo, reset } = useResumeStore();

  useEffect(() => {
    reset();
  }, [reset]);

  const handleHeadshotComplete = useCallback(
    (photoUrl: string) => {
      updatePersonalInfo({ photo: photoUrl });
      setStep("conversation");
    },
    [updatePersonalInfo]
  );

  const handleSkipHeadshot = useCallback(() => {
    setStep("conversation");
  }, []);

  const handleConversationComplete = useCallback(() => {
    setStep("review");
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          title: resume.personalInfo.firstName
            ? `CV de ${resume.personalInfo.firstName} ${resume.personalInfo.lastName}`
            : "CV cree avec IA",
          template_id: resume.templateId,
          color_primary: resume.colorPrimary,
          personal_info: resume.personalInfo as unknown as Record<string, unknown>,
          profile: resume.profile,
          education: resume.education as unknown as Record<string, unknown>[],
          experience: resume.experience as unknown as Record<string, unknown>[],
          skills: resume.skills as unknown as Record<string, unknown>[],
          languages: resume.languages as unknown as Record<string, unknown>[],
          interests: resume.interests as unknown as Record<string, unknown>[],
          custom_sections: resume.customSections as unknown as Record<string, unknown>[],
        })
        .select()
        .single();

      if (error || !data) {
        console.error("Save error:", error);
        return;
      }

      router.push(`/app/resumes/${data.id}/edit`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Creer avec l&apos;IA</span>
          <div className="flex-1 flex items-center gap-2 ml-4">
            {(["headshot", "conversation", "review"] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    step === s
                      ? "bg-primary"
                      : i < ["headshot", "conversation", "review"].indexOf(step)
                      ? "bg-primary/40"
                      : "bg-slate-200"
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={step === "headshot" ? "font-bold text-primary" : ""}>Photo</span>
            <ArrowRight className="w-3 h-3" />
            <span className={step === "conversation" ? "font-bold text-primary" : ""}>Conversation</span>
            <ArrowRight className="w-3 h-3" />
            <span className={step === "review" ? "font-bold text-primary" : ""}>Finaliser</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-20 pb-12 px-6">
        {step === "headshot" && (
          <div className="pt-12">
            <HeadshotGenerator
              onComplete={handleHeadshotComplete}
              onSkip={handleSkipHeadshot}
            />
          </div>
        )}

        {step === "conversation" && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6 pt-4">
            <div className="lg:col-span-3">
              <VoiceSession onComplete={handleConversationComplete} />
            </div>
            <div className="lg:col-span-2 hidden lg:block">
              <div className="sticky top-20 bg-white rounded-xl shadow-lg border overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Apercu en direct
                  </p>
                </div>
                <div className="p-4 max-h-[calc(100vh-7rem)] overflow-y-auto">
                  <div className="transform scale-[0.48] origin-top-left w-[208%]">
                    <ResumePreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="max-w-4xl mx-auto pt-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold">Votre CV est pret !</h2>
              <p className="text-muted-foreground">
                Verifiez l&apos;apercu ci-dessous puis cliquez pour continuer vers l&apos;editeur
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border p-8 max-w-3xl mx-auto">
              <div className="transform scale-[0.65] origin-top-left w-[153.8%]">
                <ResumePreview />
              </div>
            </div>

            <div className="flex justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep("conversation")}
              >
                Modifier via la voix
              </Button>
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving ? "Sauvegarde..." : "Continuer vers l'editeur"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
