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
import { useI18n } from "@/lib/i18n";

export function ProfileForm() {
  const { resume, setProfile } = useResumeStore();
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCircle className="w-5 h-5 text-primary" />
          {t.forms.profileTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={resume.profile}
          onChange={(e) => setProfile(e.target.value)}
          placeholder={t.forms.profilePlaceholder}
          rows={4}
          className="resize-none"
        />
      </CardContent>
    </Card>
  );
}
