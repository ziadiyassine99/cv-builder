"use client";

import { useResumeStore } from "@/store/resume-store";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserCircle } from "lucide-react";

export function ProfileForm() {
  const { resume, setProfile } = useResumeStore();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCircle className="w-5 h-5 text-primary" />
          Profil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={resume.profile}
          onChange={(e) => setProfile(e.target.value)}
          placeholder="Décrivez-vous en quelques phrases : votre parcours, vos compétences clés, et ce que vous recherchez..."
          rows={4}
          className="resize-none"
        />
      </CardContent>
    </Card>
  );
}
