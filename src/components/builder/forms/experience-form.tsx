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
import { Briefcase, Plus, Trash2 } from "lucide-react";

export function ExperienceForm() {
  const { resume, addExperience, updateExperience, removeExperience, reorderExperience } =
    useResumeStore();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Briefcase className="w-5 h-5 text-primary" />
          Expérience professionnelle
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SortableList items={resume.experience} onReorder={reorderExperience}>
          {resume.experience.map((exp) => (
            <SortableItem key={exp.id} id={exp.id}>
              <div className="border rounded-lg p-4 space-y-3 mb-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium">
                    {exp.position || "Nouveau poste"}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => removeExperience(exp.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Poste</Label>
                    <Input
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, { position: e.target.value })
                      }
                      placeholder="Développeur Full Stack"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Entreprise</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) =>
                        updateExperience(exp.id, { company: e.target.value })
                      }
                      placeholder="Nom de l'entreprise"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Ville</Label>
                  <Input
                    value={exp.city}
                    onChange={(e) =>
                      updateExperience(exp.id, { city: e.target.value })
                    }
                    placeholder="Paris"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date de début</Label>
                    <Input
                      type="month"
                      value={exp.startDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { startDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Date de fin</Label>
                    <Input
                      type="month"
                      value={exp.endDate}
                      onChange={(e) =>
                        updateExperience(exp.id, { endDate: e.target.value })
                      }
                      disabled={exp.current}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={exp.current}
                    onCheckedChange={(checked) =>
                      updateExperience(exp.id, {
                        current: checked,
                        endDate: checked ? "" : exp.endDate,
                      })
                    }
                  />
                  <Label className="text-xs">Poste actuel</Label>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) =>
                      updateExperience(exp.id, { description: e.target.value })
                    }
                    placeholder="Décrivez vos responsabilités et réalisations..."
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>

        <Button
          variant="outline"
          className="w-full"
          onClick={addExperience}
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une expérience
        </Button>
      </CardContent>
    </Card>
  );
}
