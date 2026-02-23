import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  type ResumeData,
  type PersonalInfo,
  type Education,
  type Experience,
  type Skill,
  type Language,
  type Interest,
  type CustomSection,
  defaultResumeData,
} from "@/types/resume";

interface ResumeStore {
  resume: ResumeData;
  isDirty: boolean;
  isSaving: boolean;

  setResume: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  setProfile: (profile: string) => void;
  setTemplateId: (templateId: string) => void;
  setColorPrimary: (color: string) => void;
  setTitle: (title: string) => void;

  addEducation: () => void;
  updateEducation: (id: string, data: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (items: Education[]) => void;

  addExperience: () => void;
  updateExperience: (id: string, data: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperience: (items: Experience[]) => void;

  addSkill: () => void;
  updateSkill: (id: string, data: Partial<Skill>) => void;
  removeSkill: (id: string) => void;

  addLanguage: () => void;
  updateLanguage: (id: string, data: Partial<Language>) => void;
  removeLanguage: (id: string) => void;

  addInterest: () => void;
  updateInterest: (id: string, data: Partial<Interest>) => void;
  removeInterest: (id: string) => void;

  addCustomSection: () => void;
  removeCustomSection: (id: string) => void;
  updateCustomSectionTitle: (id: string, title: string) => void;
  updateCustomSectionColumn: (id: string, column: "left" | "right") => void;
  addCustomSectionItem: (sectionId: string) => void;
  updateCustomSectionItem: (
    sectionId: string,
    itemId: string,
    data: Partial<CustomSection["items"][number]>
  ) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;

  setIsSaving: (saving: boolean) => void;
  markClean: () => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStore>((set) => ({
  resume: defaultResumeData,
  isDirty: false,
  isSaving: false,

  setResume: (data) => set({ resume: data, isDirty: false }),

  updatePersonalInfo: (info) =>
    set((state) => ({
      resume: {
        ...state.resume,
        personalInfo: { ...state.resume.personalInfo, ...info },
      },
      isDirty: true,
    })),

  setProfile: (profile) =>
    set((state) => ({
      resume: { ...state.resume, profile },
      isDirty: true,
    })),

  setTemplateId: (templateId) =>
    set((state) => ({
      resume: { ...state.resume, templateId },
      isDirty: true,
    })),

  setColorPrimary: (color) =>
    set((state) => ({
      resume: { ...state.resume, colorPrimary: color },
      isDirty: true,
    })),

  setTitle: (title) =>
    set((state) => ({
      resume: { ...state.resume, title },
      isDirty: true,
    })),

  addEducation: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: [
          ...state.resume.education,
          {
            id: uuidv4(),
            degree: "",
            school: "",
            city: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
          },
        ],
      },
      isDirty: true,
    })),

  updateEducation: (id, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
      isDirty: true,
    })),

  removeEducation: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        education: state.resume.education.filter((e) => e.id !== id),
      },
      isDirty: true,
    })),

  reorderEducation: (items) =>
    set((state) => ({
      resume: { ...state.resume, education: items },
      isDirty: true,
    })),

  addExperience: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        experience: [
          ...state.resume.experience,
          {
            id: uuidv4(),
            position: "",
            company: "",
            city: "",
            startDate: "",
            endDate: "",
            current: false,
            description: "",
          },
        ],
      },
      isDirty: true,
    })),

  updateExperience: (id, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.map((e) =>
          e.id === id ? { ...e, ...data } : e
        ),
      },
      isDirty: true,
    })),

  removeExperience: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experience: state.resume.experience.filter((e) => e.id !== id),
      },
      isDirty: true,
    })),

  reorderExperience: (items) =>
    set((state) => ({
      resume: { ...state.resume, experience: items },
      isDirty: true,
    })),

  addSkill: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: [
          ...state.resume.skills,
          { id: uuidv4(), name: "", level: 3 },
        ],
      },
      isDirty: true,
    })),

  updateSkill: (id, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.map((s) =>
          s.id === id ? { ...s, ...data } : s
        ),
      },
      isDirty: true,
    })),

  removeSkill: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        skills: state.resume.skills.filter((s) => s.id !== id),
      },
      isDirty: true,
    })),

  addLanguage: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        languages: [
          ...state.resume.languages,
          { id: uuidv4(), name: "", level: "Intermédiaire" },
        ],
      },
      isDirty: true,
    })),

  updateLanguage: (id, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        languages: state.resume.languages.map((l) =>
          l.id === id ? { ...l, ...data } : l
        ),
      },
      isDirty: true,
    })),

  removeLanguage: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        languages: state.resume.languages.filter((l) => l.id !== id),
      },
      isDirty: true,
    })),

  addInterest: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        interests: [
          ...state.resume.interests,
          { id: uuidv4(), name: "" },
        ],
      },
      isDirty: true,
    })),

  updateInterest: (id, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        interests: state.resume.interests.map((i) =>
          i.id === id ? { ...i, ...data } : i
        ),
      },
      isDirty: true,
    })),

  removeInterest: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        interests: state.resume.interests.filter((i) => i.id !== id),
      },
      isDirty: true,
    })),

  addCustomSection: () =>
    set((state) => ({
      resume: {
        ...state.resume,
        customSections: [
          ...state.resume.customSections,
          { id: uuidv4(), title: "", column: "left", items: [] },
        ],
      },
      isDirty: true,
    })),

  removeCustomSection: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        customSections: state.resume.customSections.filter((s) => s.id !== id),
      },
      isDirty: true,
    })),

  updateCustomSectionTitle: (id, title) =>
    set((state) => ({
      resume: {
        ...state.resume,
        customSections: state.resume.customSections.map((s) =>
          s.id === id ? { ...s, title } : s
        ),
      },
      isDirty: true,
    })),

  updateCustomSectionColumn: (id, column) =>
    set((state) => ({
      resume: {
        ...state.resume,
        customSections: state.resume.customSections.map((s) =>
          s.id === id ? { ...s, column } : s
        ),
      },
      isDirty: true,
    })),

  addCustomSectionItem: (sectionId) =>
    set((state) => ({
      resume: {
        ...state.resume,
        customSections: state.resume.customSections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: [
                  ...s.items,
                  {
                    id: uuidv4(),
                    title: "",
                    subtitle: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  },
                ],
              }
            : s
        ),
      },
      isDirty: true,
    })),

  updateCustomSectionItem: (sectionId, itemId, data) =>
    set((state) => ({
      resume: {
        ...state.resume,
        customSections: state.resume.customSections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                items: s.items.map((item) =>
                  item.id === itemId ? { ...item, ...data } : item
                ),
              }
            : s
        ),
      },
      isDirty: true,
    })),

  removeCustomSectionItem: (sectionId, itemId) =>
    set((state) => ({
      resume: {
        ...state.resume,
        customSections: state.resume.customSections.map((s) =>
          s.id === sectionId
            ? { ...s, items: s.items.filter((item) => item.id !== itemId) }
            : s
        ),
      },
      isDirty: true,
    })),

  setIsSaving: (saving) => set({ isSaving: saving }),
  markClean: () => set({ isDirty: false }),
  reset: () => set({ resume: defaultResumeData, isDirty: false }),
}));
