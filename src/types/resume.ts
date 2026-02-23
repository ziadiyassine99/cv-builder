export interface PersonalInfo {
  firstName: string;
  lastName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  dateOfBirth: string;
  placeOfBirth: string;
  drivingLicense: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  website: string;
  linkedin: string;
  photo: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  city: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-5
}

export interface Language {
  id: string;
  name: string;
  level: string; // "Langue maternelle" | "Courant" | "Intermédiaire" | "Débutant"
}

export interface Interest {
  id: string;
  name: string;
}

export interface CustomSection {
  id: string;
  title: string;
  column?: "left" | "right";
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ResumeData {
  id?: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  profile: string;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  interests: Interest[];
  customSections: CustomSection[];
  colorPrimary: string;
}

export const defaultPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  jobTitle: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  dateOfBirth: "",
  placeOfBirth: "",
  drivingLicense: "",
  gender: "",
  nationality: "",
  maritalStatus: "",
  website: "",
  linkedin: "",
  photo: "",
};

export const defaultResumeData: ResumeData = {
  title: "CV sans titre",
  templateId: "classic",
  personalInfo: defaultPersonalInfo,
  profile: "",
  education: [],
  experience: [],
  skills: [],
  languages: [],
  interests: [],
  customSections: [],
  colorPrimary: "#1B2A4A",
};
