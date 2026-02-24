import { useMemo, useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import sentinelLogo from "./assets/Microsoft_Sentinel.png";
import schoolLogo from "./assets/logo-ecole-mns.png";
import az500Badge from "./assets/azure-security-engineer-associate.png";
import sc200Badge from "./assets/security-operations-analyst-associate.png";
import aircloudLogo from "./assets/aircloud-removebg-preview.png";
import arcelorMittalLogo from "./assets/arcelormittal-removebg-preview.png";
import ineosLogo from "./assets/ineosauto-removebg-preview.png";
import cvPdf from "./assets/CV_2025-11-23_Alexandre_Garing.pdf";

function Section({ title, subtitle, children, className = "" }) {
  return (
    <section
      className={
        "rounded-3xl border border-white/10 bg-white/[0.025] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-colors duration-300 hover:border-white/15 sm:p-7 " +
        className
      }
    >
      <div className="mb-5 space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h2>
        {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs font-medium text-white/75 transition-all duration-300 hover:border-blue-200/30 hover:bg-blue-200/10 hover:text-white">
      {children}
    </span>
  );
}

function LinkButton({ href, children, primary = false }) {
  return (
    <a
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200/40 ${
        primary
          ? "border-blue-200/40 bg-blue-300/15 text-white hover:border-blue-200/60 hover:bg-blue-300/25 hover:shadow-[0_0_30px_rgba(138,180,255,0.2)]"
          : "border-white/15 bg-white/[0.04] text-white/90 hover:border-white/25 hover:bg-white/[0.08]"
      }`}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
    >
      {children}
    </a>
  );
}

function ExpCard({ title, when, where, bullets }) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.03]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white/95 sm:text-base">{title}</h3>
          <p className="mt-1 text-xs text-white/60 sm:text-sm">{where}</p>
        </div>
        <span className="w-fit rounded-full border border-blue-200/25 bg-blue-300/10 px-3 py-1 text-xs text-white/85">
          {when}
        </span>
      </div>
      <ul className="mt-4 space-y-2 pl-4 text-sm leading-relaxed text-white/80 marker:text-blue-200/70">
        {bullets.map((bullet, index) => (
          <li key={index} className="list-disc">
            {bullet}
          </li>
        ))}
      </ul>
    </article>
  );
}

function CertificationCard({ image, title, description, verificationLink }) {
  return (
    <article className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200/45 hover:shadow-[0_0_36px_rgba(138,180,255,0.2)]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex justify-center sm:justify-start">
          <img
            src={image}
            alt={`${title} certification badge`}
            className="h-20 w-auto object-contain sm:h-24 lg:h-28"
            loading="lazy"
          />
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
          <div className="h-px w-full bg-gradient-to-r from-blue-100/40 via-white/10 to-transparent" />
          <p className="text-sm leading-relaxed text-white/70">{description}</p>
          <a
            href={verificationLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-blue-100/50 bg-blue-200/20 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:border-blue-100/75 hover:bg-blue-200/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-100/45"
          >
            Verify credential
          </a>
        </div>
      </div>
    </article>
  );
}

const experienceCompanies = [
  { name: "AirCloud", logo: aircloudLogo },
  { name: "INEOS Automotive", logo: ineosLogo },
  { name: "ArcelorMittal", logo: arcelorMittalLogo },
];

const skillTags = [
  "Microsoft Sentinel",
  "Microsoft Defender XDR",
  "KQL Hunting & Investigations",
  "MITRE ATT&CK Detection Engineering",
  "Entra ID",
  "Conditional Access & MFA",
  "Defender for Cloud Apps",
  "Defender for Cloud (CSPM)",
  "Logic Apps / Playbooks",
  "Tenable IO / One",
  "ServiceNow / ITSM",
  "PowerShell & Python",
];

const experiences = [
  {
    title: "Air Cloud — Cloud Security Engineer (alternance)",
    when: "oct. 2025 → aujourd’hui",
    where: "Grand Est (Hybride)",
    bullets: [
      "Déploiement Microsoft Sentinel : ingestion, analytics rules et automatisation Logic Apps/playbooks.",
      "Investigations KQL, hunting ciblé et amélioration continue de la détection alignée MITRE ATT&CK.",
      "Supervision Microsoft 365 Defender XDR sur les signaux identité, endpoint, email et cloud.",
      "Gouvernance Entra ID : MFA, Conditional Access et analyse des authentifications sensibles.",
      "Durcissement de posture via Defender for Cloud Apps et Defender for Cloud (CSPM).",
    ],
  },
  {
    title: "INEOS Automotive — IT Security Analyst (alternance)",
    when: "oct. 2024 → nov. 2025",
    where: "Hambach (Grand Est)",
    bullets: [
      "Vulnerability management avec Tenable IO/One : priorisation, coordination patching et suivi VRB.",
      "Opérations SOC : alerting Taegis XDR, investigations et support niveau 1.5/2.",
      "Réponse EDR Carbon Black : quarantaine, scans et remote response.",
      "Déploiement et supervision Cisco Umbrella pour le DNS filtering.",
      "Préparation NIS2, participation CAB et actions de sensibilisation sécurité internes.",
    ],
  },
  {
    title: "Technology & Strategy (Bosch) — Validation & Verification / Test Engineer",
    when: "juin 2022 → mai 2024",
    where: "Stuttgart (DE)",
    bullets: [
      "Lead technique sur activités de validation ADAS / ParkPilot.",
      "Mesure et analyse via CANape, CANoe et CANalyzer.",
      "Tests piste/route, mentorat et montée en compétence de l’équipe.",
    ],
  },
  {
    title: "ArcelorMittal — Technicien mesures physiques / R&D",
    when: "2017 → 2022",
    where: "Maizières-lès-Metz",
    bullets: [
      "Référent qualité équipements et suivi métrologie.",
      "Mesures matériaux : métallographie, SEM, dureté, dilatométrie et essais thermiques.",
    ],
  },
];

const certifications = [
  {
    image: sc200Badge,
    title: "SC-200 — Microsoft Security Operations Analyst",
    description: "Threat detection, incident response and investigation across Microsoft security tooling.",
    verificationLink:
      "https://learn.microsoft.com/api/credentials/share/fr-fr/agaring/64CCC64B28CE2034?sharingId=4E3CE5C8334C64D1",
  },
  {
    image: az500Badge,
    title: "AZ-500 — Microsoft Azure Security Engineer",
    description: "Cloud security architecture, identity protection and governance for Azure workloads.",
    verificationLink:
      "https://learn.microsoft.com/api/credentials/share/fr-fr/agaring/766EB8CD7C70FD46?sharingId=4E3CE5C8334C64D1",
  },
];

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ type: "idle", text: "" });

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus({ type: "error", text: "Merci de remplir tous les champs." });
      return;
    }
    if (!form.email.includes("@")) {
      setStatus({ type: "error", text: "Email invalide." });
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "contacts"), {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        createdAt: serverTimestamp(),
      });
      setForm({ name: "", email: "", message: "" });
      setStatus({ type: "success", text: "Message envoyé. Merci !" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: err?.message || "Erreur lors de l’envoi." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0d10] text-white/90">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-[8%] h-72 w-72 rounded-full bg-blue-300/10 blur-3xl" />
        <div className="absolute right-[5%] top-[18%] h-80 w-80 rounded-full bg-slate-200/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-100/70">Portfolio · Cloud Security</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                Alexandre Garing
                <span className="mt-2 block text-xl font-medium text-white/80 sm:text-3xl">
                  Microsoft Cloud Security Engineer
                </span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
                I design and operate enterprise-grade detection, response, and identity security across the Microsoft ecosystem.
              </p>
              <p className="mt-2 text-sm text-white/55">Grand Est, France · Hybride</p>

              <div className="mt-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
                <img
                  src={sentinelLogo}
                  alt="Microsoft Sentinel logo"
                  className="h-8 w-auto object-contain sm:h-9 lg:h-11"
                  loading="lazy"
                />
                <span className="text-xs font-medium text-white/75 sm:text-sm">Microsoft Sentinel</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Pill>Microsoft Sentinel</Pill>
                <Pill>Defender XDR</Pill>
                <Pill>Entra ID</Pill>
                <Pill>KQL</Pill>
                <Pill>Logic Apps</Pill>
                <Pill>CSPM</Pill>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2 self-start lg:justify-end">
              <LinkButton href={cvPdf}>Download CV (PDF)</LinkButton>
              <LinkButton href="https://www.linkedin.com/in/alexandre-garing/">LinkedIn</LinkButton>
              <LinkButton href="https://github.com/Sudo-auke">GitHub</LinkButton>
              <LinkButton href="#contact" primary>
                Contact
              </LinkButton>
            </nav>
          </div>
        </header>

        <main className="mt-12 grid gap-6 lg:grid-cols-12">
          <Section title="Profil" className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-white/80 sm:text-[15px]">
              Spécialisé en sécurité cloud Microsoft, SOC operations et engineering de détection : Sentinel SIEM, Defender XDR,
              investigations KQL, gouvernance d’identités Entra ID et automatisation de réponse via Logic Apps/playbooks.
            </p>
          </Section>

          <Section title="Compétences clés" subtitle="Stack sécurité & opérations" className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {skillTags.map((skill) => (
                <span
                  key={skill}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 transition-all duration-300 hover:border-blue-200/30 hover:bg-blue-200/10 hover:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Expériences" subtitle="Parcours orienté sécurité opérationnelle" className="lg:col-span-12">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/[0.015] p-4 sm:justify-start sm:gap-5">
              {experienceCompanies.map((company) => (
                <div
                  key={company.name}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 opacity-90 transition-all duration-300 hover:opacity-100 hover:border-blue-100/35 hover:shadow-[0_0_20px_rgba(148,189,255,0.2)]"
                >
                  <img
                    src={company.logo}
                    alt={`${company.name} logo`}
                    className="h-10 w-auto object-contain sm:h-12"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {experiences.map((experience) => (
                <ExpCard key={experience.title} {...experience} />
              ))}
            </div>
          </Section>

          <Section title="Formations" subtitle="Parcours académique" className="lg:col-span-6">
            <ul className="space-y-3 text-sm text-white/80">
              <li className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                Mastère Expert ASR &amp; Sécurité Informatique — Metz Numeric School (oct. 2025 → sept. 2027)
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                Bachelor Réseaux &amp; Cybersécurité (TSSR) — Metz Numeric School (2024 → sept. 2025)
              </li>
              <li className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                Licence Pro AQI &amp; BTS Contrôle industriel / régulation — Metz (2013 → 2016)
              </li>
            </ul>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <img src={schoolLogo} alt="Metz Numeric School logo" className="h-9 w-9 rounded-md object-cover opacity-90" loading="lazy" />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-white/50">Education</p>
                <p className="text-sm text-white/80">Metz Numeric School — Cybersecurity track</p>
              </div>
            </div>
          </Section>

          <Section title="Certifications" subtitle="Validated Microsoft credentials" className="lg:col-span-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
              {certifications.map((certification) => (
                <CertificationCard key={certification.title} {...certification} />
              ))}
            </div>
          </Section>

          <Section title="Langues & intérêts" className="lg:col-span-5">
            <ul className="space-y-2 text-sm text-white/80">
              <li>Français (natif), Anglais (C1), Allemand (B2)</li>
              <li>Centres d’intérêt : cybersécurité, moto/auto, horlogerie, VTT, fitness</li>
            </ul>
          </Section>

          <Section title="Contact" subtitle="Formulaire relié à Firestore · collection contacts" className="lg:col-span-7">
            <div id="contact">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-white/70">
                    Nom
                    <input
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-blue-200/45 focus:bg-black/35 focus:ring-2 focus:ring-blue-200/15"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Votre nom"
                      autoComplete="name"
                    />
                  </label>

                  <label className="text-xs font-medium text-white/70">
                    Email
                    <input
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-blue-200/45 focus:bg-black/35 focus:ring-2 focus:ring-blue-200/15"
                      name="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="votre@email.com"
                      autoComplete="email"
                    />
                  </label>
                </div>

                <label className="block text-xs font-medium text-white/70">
                  Message
                  <textarea
                    className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-blue-200/45 focus:bg-black/35 focus:ring-2 focus:ring-blue-200/15"
                    name="message"
                    value={form.message}
                    onChange={onChange}
                    placeholder="Votre message…"
                    rows={5}
                  />
                </label>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    className="rounded-full border border-blue-200/40 bg-blue-300/15 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-blue-200/55 hover:bg-blue-300/25 hover:shadow-[0_0_28px_rgba(138,180,255,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? "Envoi..." : "Envoyer"}
                  </button>

                  {status.type !== "idle" && (
                    <p className={status.type === "success" ? "text-xs text-emerald-200/90" : "text-xs text-rose-200/90"}>
                      {status.text}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </Section>
        </main>

        <footer className="mt-8 text-center text-xs text-white/45">© {year} Alexandre Garing</footer>
      </div>
    </div>
  );
}
