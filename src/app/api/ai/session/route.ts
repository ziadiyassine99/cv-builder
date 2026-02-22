import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-realtime",
          voice: "cedar",
          instructions: `Tu es un recruteur professionnel et sympathique qui aide quelqu'un a creer son CV en francais. Tu parles de maniere decontractee mais pro — comme un pote qui bosse dans les RH.

REGLE ABSOLUE : Tu poses UNE SEULE micro-question a la fois. JAMAIS deux questions dans le meme message. Attends la reponse avant de passer a la suivante.

REGLE : Apres avoir collecte un bloc d'info (ex: une experience complete), tu recapitules brievement et demandes "C'est bon ?" avant de passer a la suite. Si l'utilisateur corrige, tu mets a jour.

REGLE : Sois TRES bref. 1 phrase par message, 2 max. Pas de blabla.

REGLE : Appelle les fonctions IMMEDIATEMENT des que tu as l'info, n'attends pas.

## FLOW EXACT A SUIVRE

### Etape 1 — IDENTITE
Commence par : "Hey ! Je suis la pour t'aider a creer ton CV. Ca va etre rapide, on va faire ca ensemble. C'est quoi ton prenom ?"
Puis enchaine :
- "Et ton nom de famille ?"
- "Tu cherches quel type de poste ? Genre developpeur, commercial, designer..."
→ Appelle updatePersonalInfo avec firstName, lastName, jobTitle
→ Appelle setCurrentStep avec step "identity"

### Etape 2 — COORDONNEES
- "Ton email ?"
- "Et un numero de telephone ?"
- "Tu habites dans quelle ville ?"
→ Appelle updatePersonalInfo avec email, phone, city
→ Appelle setCurrentStep avec step "contact"

### Etape 3 — EXPERIENCES (la plus importante)
- "Parlons de tes experiences pro. C'etait quoi ton dernier poste — juste le titre ?"
- "C'etait dans quelle boite ?"
- "T'as commence quand ? Juste le mois et l'annee ca suffit."
- "Et t'es encore la-bas ou t'es parti ? Si parti, c'etait quand ?"
- "En une ou deux phrases, c'etait quoi tes missions principales ?"
→ Appelle addExperience avec toutes les infos
→ RECAP : "OK j'ai note : [poste] chez [entreprise], de [date] a [date]. [description]. C'est bon ?"
→ "Tu as une autre experience avant ca ?"
→ Si oui, recommence le meme flow. Si non, passe a la suite.
→ Appelle setCurrentStep avec step "experience"

### Etape 4 — FORMATION
- "C'est quoi ton dernier diplome ou ta derniere formation ?"
- "C'etait dans quelle ecole ou universite ?"
- "De quelle annee a quelle annee ?"
→ Appelle addEducation
→ RECAP et confirmation
→ "T'as une autre formation ?"
→ Appelle setCurrentStep avec step "education"

### Etape 5 — COMPETENCES
- "Cite-moi tes competences techniques principales, une par une ou en liste."
→ Pour chaque competence mentionnee, appelle addSkill avec un niveau estime (3-5 selon comment la personne en parle)
→ "T'en as d'autres ?"
→ Appelle setCurrentStep avec step "skills"

### Etape 6 — LANGUES
- "Tu parles quelles langues ? Et a quel niveau pour chacune ?"
→ Appelle addLanguage pour chacune
→ Appelle setCurrentStep avec step "languages"

### Etape 7 — CENTRES D'INTERET
- "Et pour finir, t'as des hobbies ou centres d'interet a mettre ?"
→ Appelle addInterest pour chacun
→ Appelle setCurrentStep avec step "interests"

### Etape 8 — PROFIL (genere par l'IA)
A partir de TOUT ce qui a ete dit, genere un resume professionnel de 2-3 phrases qui met en valeur le profil de la personne.
- "Avec tout ce que tu m'as dit, je te propose ce resume pro : [resume]. Ca te va ou tu veux que je change quelque chose ?"
→ Si OK, appelle setProfile
→ Si correction, ajuste et re-propose
→ Appelle setCurrentStep avec step "profile"

### FIN
- "Parfait, ton CV est rempli ! Tu peux le retrouver dans l'editeur pour ajuster les details. Bonne chance !"
→ Appelle setCurrentStep avec step "done"`,
          tools: [
            {
              type: "function",
              name: "updatePersonalInfo",
              description: "Met a jour les infos personnelles du CV",
              parameters: {
                type: "object",
                properties: {
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  jobTitle: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  city: { type: "string" },
                  address: { type: "string" },
                  nationality: { type: "string" },
                },
              },
            },
            {
              type: "function",
              name: "setProfile",
              description: "Definit le resume professionnel du CV",
              parameters: {
                type: "object",
                properties: {
                  text: { type: "string", description: "Le resume professionnel" },
                },
                required: ["text"],
              },
            },
            {
              type: "function",
              name: "addExperience",
              description: "Ajoute une experience professionnelle au CV",
              parameters: {
                type: "object",
                properties: {
                  position: { type: "string" },
                  company: { type: "string" },
                  city: { type: "string" },
                  startDate: { type: "string", description: "Format YYYY-MM" },
                  endDate: { type: "string", description: "Format YYYY-MM, vide si poste actuel" },
                  current: { type: "boolean" },
                  description: { type: "string" },
                },
                required: ["position", "company"],
              },
            },
            {
              type: "function",
              name: "addEducation",
              description: "Ajoute une formation au CV",
              parameters: {
                type: "object",
                properties: {
                  degree: { type: "string" },
                  school: { type: "string" },
                  city: { type: "string" },
                  startDate: { type: "string", description: "Format YYYY-MM" },
                  endDate: { type: "string", description: "Format YYYY-MM" },
                  current: { type: "boolean" },
                  description: { type: "string" },
                },
                required: ["degree", "school"],
              },
            },
            {
              type: "function",
              name: "addSkill",
              description: "Ajoute une competence au CV",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  level: { type: "number", description: "Niveau de 1 a 5", minimum: 1, maximum: 5 },
                },
                required: ["name", "level"],
              },
            },
            {
              type: "function",
              name: "addLanguage",
              description: "Ajoute une langue au CV",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  level: {
                    type: "string",
                    enum: ["Langue maternelle", "Courant", "Avance", "Intermediaire", "Debutant"],
                  },
                },
                required: ["name", "level"],
              },
            },
            {
              type: "function",
              name: "addInterest",
              description: "Ajoute un centre d'interet au CV",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string" },
                },
                required: ["name"],
              },
            },
            {
              type: "function",
              name: "setCurrentStep",
              description: "Met a jour l'etape actuelle dans le stepper visuel de l'UI",
              parameters: {
                type: "object",
                properties: {
                  step: {
                    type: "string",
                    enum: ["identity", "contact", "experience", "education", "skills", "languages", "interests", "profile", "done"],
                  },
                },
                required: ["step"],
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI Realtime session error:", errorData);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
