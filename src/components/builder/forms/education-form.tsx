"use client";

import { useResumeStore } from "@/store/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SortableList } from "@/components/builder/sortable-list";
import { SortableItem } from "@/components/builder/sortable-item";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function EducationForm() {
  const { resume, addEducation, updateEducation, removeEducation, reorderEducation } =
    useResumeStore();
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <GraduationCap className="w-5 h-5 text-primary" />
          {t.forms.educationTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SortableList items={resume.education} onReorder={reorderEducation}>
          {resume.education.map((edu) => (
            <SortableItem key={edu.id} id={edu.id}>
              <div className="border rounded-lg p-4 space-y-3 mb-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium">
                    {edu.degree || t.forms.newEducation}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeEducation(edu.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t.forms.degree}</Label>
                    <Input
                      value={edu.degree}
                      onChange={(e) =>
                        updateEducation(edu.id, { degree: e.target.value })
                      }
                      placeholder="Master Informatique"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t.forms.school}</Label>
                    <Input
                      value={edu.school}
                      onChange={(e) =>
                        updateEducation(edu.id, { school: e.target.value })
                      }
                      placeholder={t.forms.schoolPlaceholder}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">{t.forms.city}</Label>
                  <Input
                    value={edu.city}
                    onChange={(e) =>
                      updateEducation(edu.id, { city: e.target.value })
                    }
                    placeholder="Paris"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t.forms.startDate}</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) =>
                        updateEducation(edu.id, { startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">{t.forms.endDate}</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) =>
                        updateEducation(edu.id, { endDate: e.target.value })
                      }
                      disabled={edu.current}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={edu.current}
                    onCheckedChange={(checked) =>
                      updateEducation(edu.id, {
                        current: checked,
                        endDate: checked ? "" : edu.endDate,
                      })
                    }
                  />
                  <Label className="text-xs">{t.forms.currentEducation}</Label>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">{t.forms.description}</Label>
                  <Textarea
                    value={edu.description}
                    onChange={(e) =>
                      updateEducation(edu.id, { description: e.target.value })
                    }
                    placeholder={t.forms.educationDescPlaceholder}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>

        <Button variant="outline" className="w-full" onClick={addEducation}>
          <Plus className="w-4 h-4 mr-2" />
          {t.forms.addEducation}
        </Button>
      </CardContent>
    </Card>
  );
}
