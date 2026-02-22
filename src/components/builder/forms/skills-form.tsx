"use client";

import { useResumeStore } from "@/store/resume-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wrench, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SkillsForm() {
  const { resume, addSkill, updateSkill, removeSkill } = useResumeStore();
  const { t } = useI18n();
  const levelLabels = ["", ...t.forms.skillLevels];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wrench className="w-5 h-5 text-primary" />
          {t.forms.skillsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {resume.skills.map((skill) => (
          <div key={skill.id} className="flex items-center gap-2">
            <Input
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
              placeholder="Ex: React, Python, Excel..."
              className="flex-1"
            />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => updateSkill(skill.id, { level })}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    level <= skill.level
                      ? "bg-primary"
                      : "bg-slate-200"
                  }`}
                  title={levelLabels[level]}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive shrink-0"
              onClick={() => removeSkill(skill.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" className="w-full" onClick={addSkill}>
          <Plus className="w-4 h-4 mr-2" />
          {t.forms.addSkill}
        </Button>
      </CardContent>
    </Card>
  );
}
