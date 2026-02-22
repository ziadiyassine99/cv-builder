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
import { Heart, Plus, X } from "lucide-react";

export function InterestsForm() {
  const { resume, addInterest, updateInterest, removeInterest } =
    useResumeStore();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Heart className="w-5 h-5 text-primary" />
          Centres d&apos;intérêt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {resume.interests.map((interest) => (
            <div
              key={interest.id}
              className="flex items-center gap-1 border rounded-full px-3 py-1"
            >
              <Input
                value={interest.name}
                onChange={(e) =>
                  updateInterest(interest.id, { name: e.target.value })
                }
                placeholder="Intérêt..."
                className="border-0 p-0 h-auto text-sm w-24 focus-visible:ring-0"
              />
              <button
                type="button"
                onClick={() => removeInterest(interest.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full" onClick={addInterest}>
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un centre d&apos;intérêt
        </Button>
      </CardContent>
    </Card>
  );
}
