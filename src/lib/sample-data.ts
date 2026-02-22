import type { PersonalInfo, Education, Experience, Skill, Language, Interest } from "@/types/resume";

export const samplePersonalInfo: PersonalInfo = {
  firstName: "Marie",
  lastName: "Laurent",
  jobTitle: "Développeuse Full Stack",
  email: "marie.laurent@email.com",
  phone: "+33 6 12 34 56 78",
  address: "15 Rue de la République",
  postalCode: "75011",
  city: "Paris",
  dateOfBirth: "1995-03-15",
  placeOfBirth: "Lyon",
  drivingLicense: "B",
  gender: "",
  nationality: "Française",
  maritalStatus: "",
  website: "marielaurent.dev",
  linkedin: "linkedin.com/in/marielaurent",
  photo: "",
};

export const sampleExperience: Experience[] = [
  {
    id: "exp-1",
    position: "Développeuse Full Stack Senior",
    company: "TechVision SAS",
    city: "Paris",
    startDate: "2022-03",
    endDate: "",
    current: true,
    description:
      "Conception et développement d'une plateforme SaaS B2B (React, Node.js, PostgreSQL). Encadrement d'une équipe de 3 développeurs juniors. Mise en place de CI/CD et réduction du temps de déploiement de 60%.",
  },
  {
    id: "exp-2",
    position: "Développeuse Front-end",
    company: "Agence Digitale Créative",
    city: "Lyon",
    startDate: "2019-09",
    endDate: "2022-02",
    current: false,
    description:
      "Développement de sites web et applications pour des clients variés (e-commerce, corporate, startup). Technologies : React, Vue.js, TypeScript, Tailwind CSS. Participation aux phases de conception UX/UI.",
  },
  {
    id: "exp-3",
    position: "Stage Développeuse Web",
    company: "StartupLab",
    city: "Lyon",
    startDate: "2019-02",
    endDate: "2019-07",
    current: false,
    description:
      "Développement de fonctionnalités front-end pour une application mobile hybride. Introduction aux méthodologies Agile/Scrum.",
  },
];

export const sampleEducation: Education[] = [
  {
    id: "edu-1",
    degree: "Master Informatique — Génie Logiciel",
    school: "Université Claude Bernard",
    city: "Lyon",
    startDate: "2017-09",
    endDate: "2019-06",
    current: false,
    description:
      "Spécialisation en développement web et architectures distribuées. Projet de fin d'études : plateforme collaborative en temps réel.",
  },
  {
    id: "edu-2",
    degree: "Licence Informatique",
    school: "Université Claude Bernard",
    city: "Lyon",
    startDate: "2014-09",
    endDate: "2017-06",
    current: false,
    description: "Fondamentaux en algorithmique, bases de données et programmation orientée objet.",
  },
];

export const sampleSkills: Skill[] = [
  { id: "skill-1", name: "React / Next.js", level: 5 },
  { id: "skill-2", name: "TypeScript", level: 5 },
  { id: "skill-3", name: "Node.js", level: 4 },
  { id: "skill-4", name: "PostgreSQL", level: 4 },
  { id: "skill-5", name: "Docker / CI-CD", level: 3 },
  { id: "skill-6", name: "Figma / UI Design", level: 3 },
];

export const sampleLanguages: Language[] = [
  { id: "lang-1", name: "Français", level: "Langue maternelle" },
  { id: "lang-2", name: "Anglais", level: "Courant" },
  { id: "lang-3", name: "Espagnol", level: "Intermédiaire" },
];

export const sampleInterests: Interest[] = [
  { id: "int-1", name: "Open source" },
  { id: "int-2", name: "Photographie" },
  { id: "int-3", name: "Randonnée" },
  { id: "int-4", name: "Cuisine japonaise" },
];

export const sampleProfile =
  "Développeuse Full Stack passionnée avec 5 ans d'expérience dans la conception d'applications web modernes. Expertise en React, Node.js et architectures cloud. Orientée résultats, j'aime résoudre des problèmes complexes et créer des expériences utilisateur fluides. À la recherche d'un poste stimulant au sein d'une équipe innovante.";
