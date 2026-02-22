"use client";

import { useResumeStore } from "@/store/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LayoutList, Plus, Trash2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function CustomSectionsForm() {
  const {
    resume,
    addCustomSection,
    removeCustomSection,
    updateCustomSectionTitle,
    addCustomSectionItem,
    updateCustomSectionItem,
    removeCustomSectionItem,
  } = useResumeStore();
  const { t } = useI18n();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <LayoutList className="w-5 h-5 text-primary" />
          {t.forms.customSectionsTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {resume.customSections.map((section) => (
          <div key={section.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={section.title}
                onChange={(e) =>
                  updateCustomSectionTitle(section.id, e.target.value)
                }
                placeholder={t.forms.sectionTitlePlaceholder}
                className="flex-1 font-medium"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive shrink-0"
                onClick={() => removeCustomSection(section.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {section.items.map((item) => (
              <div
                key={item.id}
                className="border rounded-md p-3 space-y-2 bg-slate-50"
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {item.title || t.forms.newItem}
                  </h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() =>
                      removeCustomSectionItem(section.id, item.id)
                    }
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">{t.forms.title}</Label>
                    <Input
                      value={item.title}
                      onChange={(e) =>
                        updateCustomSectionItem(section.id, item.id, {
                          title: e.target.value,
                        })
                      }
                      placeholder="SwapIT"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{t.forms.subtitle}</Label>
                    <Input
                      value={item.subtitle}
                      onChange={(e) =>
                        updateCustomSectionItem(section.id, item.id, {
                          subtitle: e.target.value,
                        })
                      }
                      placeholder="Full-Stack Barter Platform"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">{t.forms.description}</Label>
                  <Textarea
                    value={item.description}
                    onChange={(e) =>
                      updateCustomSectionItem(section.id, item.id, {
                        description: e.target.value,
                      })
                    }
                    placeholder={t.forms.customDescPlaceholder}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            ))}

            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => addCustomSectionItem(section.id)}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              {t.forms.addItem}
            </Button>
          </div>
        ))}

        <Button variant="outline" className="w-full" onClick={addCustomSection}>
          <Plus className="w-4 h-4 mr-2" />
          {t.forms.addSection}
        </Button>
      </CardContent>
    </Card>
  );
}
