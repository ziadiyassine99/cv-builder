"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useI18n } from "@/lib/i18n";
import { Download, Sparkles, ChevronRight, LayoutTemplate, PenTool } from "lucide-react";

export default function LandingPage() {
  const { t } = useI18n();

  const templates = [
    { id: "classic", name: t.landing.templateClassic, desc: t.landing.templateClassicDesc, image: "/templates/classic.png" },
    { id: "professional", name: t.landing.templateProfessional, desc: t.landing.templateProfessionalDesc, image: "/templates/vertical.png" },
    { id: "vertical", name: t.landing.templateCreative, desc: t.landing.templateCreativeDesc, image: "/templates/professional.png" },
  ];

  const features = [
    { icon: PenTool, title: t.landing.editorTitle, desc: t.landing.editorDescription },
    { icon: LayoutTemplate, title: t.landing.featureDnd, desc: t.landing.featureDndDesc },
    { icon: Sparkles, title: t.landing.featureAi, desc: t.landing.featureAiDesc },
    { icon: Download, title: t.landing.featurePdf, desc: t.landing.featurePdfDesc },
  ];

  return (
    <div className="min-h-screen bg-[#fbfbfd] selection:bg-primary/20">
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-black/[0.04]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-sm">CV</div>
            Builder
          </span>
          <div className="flex items-center gap-4 text-sm font-medium">
            <LanguageSelector />
            <Link href="/login" className="text-slate-500 hover:text-slate-900 transition-colors">
              {t.common.login}
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-6 font-medium shadow-sm hover:shadow-md transition-all">
                {t.landing.startFree}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 blur-[100px] rounded-full mix-blend-multiply" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/[0.03] border border-black/[0.05] mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-slate-800">{t.landing.badge}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-slate-900 mb-8 max-w-4xl mx-auto leading-[1.1]">
            {t.landing.heroTitle1} <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">
              {t.landing.heroTitle2}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-2xl mx-auto tracking-tight font-light leading-relaxed">
            {t.landing.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 py-7 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300">
                {t.landing.cta}
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg border-black/10 hover:bg-black/5 hover:text-slate-900 transition-all duration-300">
                {t.landing.ctaLogin} <ChevronRight className="ml-2 w-5 h-5 opacity-50" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">{t.landing.templatesTitle}</h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">{t.landing.templatesDescription}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {templates.map((template) => (
              <div key={template.id} className="group cursor-pointer">
                <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-black/[0.04] aspect-[1/1.4] mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-black/[0.08] group-hover:-translate-y-2">
                  <Image src={template.image} alt={template.name} fill className="object-cover object-top transition-transform duration-700 group-hover:scale-105" priority />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.02] transition-colors duration-500" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-xl text-slate-900 tracking-tight">{template.name}</h3>
                  <p className="text-slate-500 mt-2 text-sm">{template.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white border border-black/[0.04] shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 border border-black/[0.04]">
                  <feature.icon className="w-6 h-6 text-slate-700" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 tracking-tight mb-3">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold tracking-tighter text-slate-900 mb-8">{t.landing.footerCta}</h2>
          <Link href="/register">
            <Button size="lg" className="rounded-full px-10 py-8 text-xl shadow-2xl shadow-primary/25 hover:scale-105 hover:shadow-primary/40 transition-all duration-300">
              {t.landing.cta}
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-black/[0.05] bg-[#fbfbfd] py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold tracking-tight">
            <div className="w-6 h-6 rounded-lg bg-black text-white flex items-center justify-center text-xs">CV</div>
            Builder
          </div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} {t.landing.footerCopy}</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="#" className="hover:text-slate-900 transition-colors">{t.landing.privacy}</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">{t.landing.terms}</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">{t.landing.contact}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
