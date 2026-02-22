"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { ResumeCardActions } from "@/components/dashboard/resume-card-actions";
import { Plus, FileText } from "lucide-react";

interface Resume {
  id: string;
  title: string;
  template_id: string;
  updated_at: string;
  color_primary: string;
  [key: string]: unknown;
}

interface DashboardClientProps {
  userEmail: string;
  resumes: Resume[] | null;
}

export function DashboardClient({ userEmail, resumes }: DashboardClientProps) {
  const { t } = useI18n();

  const templateNames: Record<string, string> = {
    classic: t.dashboard.templateClassic,
    professional: t.dashboard.templateProfessional,
    vertical: t.dashboard.templateVertical,
    elegant: t.dashboard.templateElegant,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            CV Builder
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{userEmail}</span>
            <LanguageSelector />
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t.dashboard.title}</h1>
            <p className="text-muted-foreground mt-1">
              {t.dashboard.description}
            </p>
          </div>
          <Link href="/app/resumes/new" prefetch={false}>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              {t.dashboard.newResume}
            </Button>
          </Link>
        </div>

        {!resumes || resumes.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                {t.dashboard.empty}
              </h2>
              <p className="text-muted-foreground mb-6">
                {t.dashboard.emptyDescription}
              </p>
              <Link href="/app/resumes/new" prefetch={false}>
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  {t.dashboard.emptyAction}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card
                key={resume.id}
                className="hover:shadow-lg transition-shadow group relative"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 pr-2">
                      <CardTitle className="text-lg truncate">
                        {resume.title}
                      </CardTitle>
                      <CardDescription>
                        {t.dashboard.modifiedOn}{" "}
                        {new Date(resume.updated_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </CardDescription>
                    </div>
                    <ResumeCardActions resume={resume as never} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: resume.color_primary }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {templateNames[resume.template_id] || resume.template_id}
                    </span>
                  </div>
                  <Link href={`/app/resumes/${resume.id}/edit`}>
                    <Button variant="outline" className="w-full">
                      {t.dashboard.edit}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
