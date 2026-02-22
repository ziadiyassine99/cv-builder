"use client";

import { useResumeStore } from "@/store/resume-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const levels = [
  "Native",
  "C2",
  "C1",
  "B2",
  "B1",
  "A2",
  "A1",
];

export function LanguagesForm() {
  const { resume, addLanguage, updateLanguage, removeLanguage } =
    useResumeStore();
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="w-5 h-5 text-primary" />
          {t.forms.languagesTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.languages.map((lang) => (
          <div key={lang.id} className="flex items-center gap-2">
            <Input
              value={lang.name}
              onChange={(e) =>
                updateLanguage(lang.id, { name: e.target.value })
              }
              placeholder={t.forms.languagePlaceholder}
              className="flex-1"
            />
            <Select
              value={lang.level}
              onValueChange={(value) =>
                updateLanguage(lang.id, { level: value })
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive shrink-0"
              onClick={() => removeLanguage(lang.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" className="w-full" onClick={addLanguage}>
          <Plus className="w-4 h-4 mr-2" />
          {t.forms.addLanguage}
        </Button>
      </CardContent>
    </Card>
  );
}
