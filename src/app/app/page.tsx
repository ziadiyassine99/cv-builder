import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogoutButton } from "@/components/auth/logout-button";
import { ResumeCardActions } from "@/components/dashboard/resume-card-actions";
import { Plus, FileText } from "lucide-react";

const templateNames: Record<string, string> = {
  classic: "Circulaire",
  professional: "Professionnel",
  vertical: "Vertical",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: resumes } = await supabase
    .from("resumes")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            CV Builder
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mes CV</h1>
            <p className="text-muted-foreground mt-1">
              Créez et gérez vos curriculum vitae
            </p>
          </div>
          <Link href="/app/resumes/new">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Nouveau CV
            </Button>
          </Link>
        </div>

        {!resumes || resumes.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucun CV</h2>
              <p className="text-muted-foreground mb-6">
                Commencez par creer votre premier CV professionnel
              </p>
              <Link href="/app/resumes/new">
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Creer mon premier CV
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
                        Modifié le{" "}
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
                    <ResumeCardActions resume={resume} />
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
                      Modifier
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
