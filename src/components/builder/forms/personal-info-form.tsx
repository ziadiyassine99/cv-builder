"use client";

import { useResumeStore } from "@/store/resume-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { PhotoUpload } from "./photo-upload";
import { useI18n } from "@/lib/i18n";

const TEMPLATES_WITH_PHOTO = ["professional", "vertical", "elegant"];

export function PersonalInfoForm() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const { t } = useI18n();
  const info = resume.personalInfo;
  const [showMore, setShowMore] = useState(false);
  const showPhoto = TEMPLATES_WITH_PHOTO.includes(resume.templateId);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="w-5 h-5 text-primary" />
          {t.forms.personalInfo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showPhoto && <PhotoUpload />}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="firstName" className="text-xs">
              {t.forms.firstName}
            </Label>
            <Input
              id="firstName"
              value={info.firstName}
              onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
              placeholder="Jean"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName" className="text-xs">
              {t.forms.lastName}
            </Label>
            <Input
              id="lastName"
              value={info.lastName}
              onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
              placeholder="Dupont"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="jobTitle" className="text-xs">
            {t.forms.jobTitle}
          </Label>
          <Input
            id="jobTitle"
            value={info.jobTitle}
            onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
            placeholder={t.forms.jobTitlePlaceholder}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs">
              {t.forms.email}
            </Label>
            <Input
              id="email"
              type="email"
              value={info.email}
              onChange={(e) => updatePersonalInfo({ email: e.target.value })}
              placeholder="jean@exemple.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs">
              {t.forms.phone}
            </Label>
            <Input
              id="phone"
              value={info.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-xs">
            {t.forms.address}
          </Label>
          <Input
            id="address"
            value={info.address}
            onChange={(e) => updatePersonalInfo({ address: e.target.value })}
            placeholder="12 Rue de la Paix"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="postalCode" className="text-xs">
              {t.forms.postalCode}
            </Label>
            <Input
              id="postalCode"
              value={info.postalCode}
              onChange={(e) =>
                updatePersonalInfo({ postalCode: e.target.value })
              }
              placeholder="75001"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="city" className="text-xs">
              {t.forms.city}
            </Label>
            <Input
              id="city"
              value={info.city}
              onChange={(e) => updatePersonalInfo({ city: e.target.value })}
              placeholder="Paris"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {showMore ? (
            <>
              <ChevronUp className="w-4 h-4" /> {t.forms.lessOptions}
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" /> {t.forms.moreOptions}
            </>
          )}
        </button>

        {showMore && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-xs">
                  {t.forms.birthDate}
                </Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={info.dateOfBirth}
                  onChange={(e) =>
                    updatePersonalInfo({ dateOfBirth: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nationality" className="text-xs">
                  {t.forms.nationality}
                </Label>
                <Input
                  id="nationality"
                  value={info.nationality}
                  onChange={(e) =>
                    updatePersonalInfo({ nationality: e.target.value })
                  }
                  placeholder={t.forms.nationalityPlaceholder}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="drivingLicense" className="text-xs">
                  {t.forms.drivingLicense}
                </Label>
                <Input
                  id="drivingLicense"
                  value={info.drivingLicense}
                  onChange={(e) =>
                    updatePersonalInfo({ drivingLicense: e.target.value })
                  }
                  placeholder="B"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maritalStatus" className="text-xs">
                  {t.forms.maritalStatus}
                </Label>
                <Input
                  id="maritalStatus"
                  value={info.maritalStatus}
                  onChange={(e) =>
                    updatePersonalInfo({ maritalStatus: e.target.value })
                  }
                  placeholder={t.forms.maritalStatusPlaceholder}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-xs">
                  {t.forms.website}
                </Label>
                <Input
                  id="website"
                  value={info.website}
                  onChange={(e) =>
                    updatePersonalInfo({ website: e.target.value })
                  }
                  placeholder="https://monsite.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedin" className="text-xs">
                  {t.forms.linkedin}
                </Label>
                <Input
                  id="linkedin"
                  value={info.linkedin}
                  onChange={(e) =>
                    updatePersonalInfo({ linkedin: e.target.value })
                  }
                  placeholder="linkedin.com/in/jean"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
