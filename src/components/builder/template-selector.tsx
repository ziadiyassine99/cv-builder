"use client";

import { useResumeStore } from "@/store/resume-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { ProfessionalTemplate } from "@/components/templates/professional-template";
import { VerticalTemplate } from "@/components/templates/vertical-template";
import type { ResumeData } from "@/types/resume";

const templates = [
  {
    id: "classic",
    name: "Classique",
    description: "Traditionnel, sans photo",
    Component: ClassicTemplate,
  },
  {
    id: "professional",
    name: "Étudiant",
    description: "Photo, 2 colonnes",
    Component: ProfessionalTemplate,
  },
  {
    id: "vertical",
    name: "Ingénieur",
    description: "Photo, timeline",
    Component: VerticalTemplate,
  },
];

const presetColors = [
  "#1B2A4A",
  "#0e7490",
  "#0d9488",
  "#059669",
  "#2563eb",
  "#4f46e5",
  "#7c3aed",
  "#be185d",
  "#dc2626",
  "#334155",
];

function buildSampleData(color: string): ResumeData {
  return {
    title: "CV",
    templateId: "classic",
    personalInfo: {
      firstName: "Marie",
      lastName: "Laurent",
      jobTitle: "Développeuse Full Stack",
      email: "marie@email.com",
      phone: "+33 6 12 34 56 78",
      address: "15 Rue de la République",
      postalCode: "75011",
      city: "Paris",
      dateOfBirth: "",
      placeOfBirth: "",
      drivingLicense: "B",
      gender: "",
      nationality: "Française",
      maritalStatus: "",
      website: "www.marielaurent.dev",
      linkedin: "linkedin.com/in/marielaurent",
      photo: "",
    },
    profile:
      "Développeuse Full Stack passionnée avec 5 ans d'expérience. Expertise en React, Node.js et architectures cloud. Orientée résultats, résolution de problèmes complexes.",
    education: [
      {
        id: "1",
        degree: "Master Informatique",
        school: "Université Claude Bernard",
        city: "Lyon",
        startDate: "2017-09",
        endDate: "2019-06",
        current: false,
        description: "",
      },
      {
        id: "2",
        degree: "Licence Informatique",
        school: "Université Claude Bernard",
        city: "Lyon",
        startDate: "2014-09",
        endDate: "2017-06",
        current: false,
        description: "",
      },
    ],
    experience: [
      {
        id: "1",
        position: "Développeuse Full Stack Senior",
        company: "TechVision SAS",
        city: "Paris",
        startDate: "2022-03",
        endDate: "",
        current: true,
        description:
          "Conception et développement d'une plateforme SaaS B2B\nEncadrement d'une équipe de 3 développeurs\nMise en place de CI/CD et réduction du temps de déploiement de 60%",
      },
      {
        id: "2",
        position: "Développeuse Front-End",
        company: "Agence Digitale Créative",
        city: "Lyon",
        startDate: "2019-09",
        endDate: "2022-02",
        current: false,
        description:
          "Développement de sites web et applications\nTechnologies : React, Vue.js, TypeScript, Tailwind CSS",
      },
    ],
    skills: [
      { id: "1", name: "React / Next.js", level: 5 },
      { id: "2", name: "TypeScript", level: 4 },
      { id: "3", name: "Node.js", level: 4 },
      { id: "4", name: "PostgreSQL", level: 3 },
      { id: "5", name: "Docker / CI-CD", level: 3 },
    ],
    languages: [
      { id: "1", name: "Français", level: "Langue maternelle" },
      { id: "2", name: "Anglais", level: "Courant" },
      { id: "3", name: "Portugais", level: "Intermédiaire" },
    ],
    interests: [
      { id: "1", name: "Photographie" },
      { id: "2", name: "Randonnée" },
      { id: "3", name: "Cuisine japonaise" },
    ],
    customSections: [],
    colorPrimary: color,
  };
}

function ScaledTemplatePreview({
  templateId,
  color,
  active,
}: {
  templateId: string;
  color: string;
  active: boolean;
}) {
  const template = templates.find((t) => t.id === templateId);
  if (!template) return null;

  const { Component } = template;
  const sampleData = buildSampleData(color);

  const ring = active
    ? "border-primary ring-2 ring-primary/20"
    : "border-slate-200 hover:border-slate-300";

  return (
    <div
      className={`w-full aspect-[210/297] rounded border-2 overflow-hidden transition-all relative ${ring}`}
    >
      <div
        className="origin-top-left absolute top-0 left-0 bg-white"
        style={{
          width: "210mm",
          height: "297mm",
          transform: "scale(0.133)",
          transformOrigin: "top left",
        }}
      >
        <Component data={sampleData} />
      </div>
    </div>
  );
}

export function TemplateSelector() {
  const { resume, setTemplateId, setColorPrimary } = useResumeStore();
  const hideColorPicker = resume.templateId === "classic";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Palette className="w-5 h-5 text-primary" />
          Modèle et couleur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id)}
              className="text-center space-y-2"
            >
              <ScaledTemplatePreview
                templateId={t.id}
                color={resume.colorPrimary}
                active={resume.templateId === t.id}
              />
              <div>
                <div className="text-xs font-medium">{t.name}</div>
                <div className="text-[10px] text-muted-foreground">
                  {t.description}
                </div>
              </div>
            </button>
          ))}
        </div>

        {!hideColorPicker && (
          <div className="space-y-2">
            <Label className="text-xs">Couleur principale</Label>
            <div className="flex items-center gap-2 flex-wrap">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setColorPrimary(color)}
                  className={`w-7 h-7 rounded-full transition-all ${
                    resume.colorPrimary === color
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <div className="relative">
                <Input
                  type="color"
                  value={resume.colorPrimary}
                  onChange={(e) => setColorPrimary(e.target.value)}
                  className="w-7 h-7 p-0 border-0 cursor-pointer rounded-full"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
