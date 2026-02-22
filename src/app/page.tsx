import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Palette, Download, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">CV Builder</span>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-white to-blue-50 py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Créez votre CV{" "}
            <span className="text-primary">professionnel</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Remplissez le formulaire, choisissez un modèle et téléchargez votre
            CV en quelques minutes. Simple, rapide, gratuit.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Créer mon CV
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                J&apos;ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            3 modèles professionnels
          </h2>
          <p className="text-slate-600 text-center mb-12 max-w-xl mx-auto">
            Choisissez parmi nos modèles soigneusement conçus pour mettre en
            valeur votre parcours
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Circulaire",
                desc: "Sidebar colorée à gauche, moderne et élégant",
                color: "#0e7490",
              },
              {
                name: "Professionnel",
                desc: "Mise en page traditionnelle, sobre et corporate",
                color: "#334155",
              },
              {
                name: "Vertical",
                desc: "Sidebar à droite, design contrasté et structuré",
                color: "#7c3aed",
              },
            ].map((template) => (
              <div
                key={template.name}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-48 flex items-center justify-center"
                  style={{ backgroundColor: `${template.color}10` }}
                >
                  <div
                    className="w-24 h-32 rounded bg-white shadow-md border-l-4"
                    style={{ borderColor: template.color }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    {template.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                step: "1",
                title: "Remplissez vos infos",
                desc: "Saisissez vos informations personnelles, expériences, formations et compétences.",
              },
              {
                icon: Palette,
                step: "2",
                title: "Choisissez un modèle",
                desc: "Sélectionnez un modèle et personnalisez les couleurs selon votre style.",
              },
              {
                icon: Download,
                step: "3",
                title: "Téléchargez",
                desc: "Téléchargez votre CV au format PDF, prêt à envoyer aux recruteurs.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-sm font-bold text-primary mb-2">
                  Étape {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fonctionnalités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "CV illimités",
                desc: "Créez autant de CV que vous voulez, modifiez-les à tout moment.",
              },
              {
                icon: Palette,
                title: "Personnalisation",
                desc: "Couleurs, modèles, sections — adaptez votre CV à votre style.",
              },
              {
                icon: Download,
                title: "Export PDF",
                desc: "Téléchargez votre CV en PDF haute qualité en un clic.",
              },
              {
                icon: Sparkles,
                title: "Sauvegarde auto",
                desc: "Vos modifications sont sauvegardées automatiquement.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-xl border hover:shadow-md transition-shadow"
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à créer votre CV ?
          </h2>
          <p className="text-lg opacity-90 mb-8">
            Rejoignez des milliers d&apos;utilisateurs et créez votre CV
            professionnel gratuitement.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6"
            >
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-600">
          <p>© 2026 CV Builder. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
