import { useEffect, useMemo, useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import schoolLogo from "./assets/logo-ecole-mns.png";
import az500Badge from "./assets/azure-security-engineer-associate.png";
import sc200Badge from "./assets/security-operations-analyst-associate.png";
import aircloudLogo from "./assets/aircloud-removebg-preview.png";
import arcelorMittalLogo from "./assets/arcelormittal-removebg-preview.png";
import ineosLogo from "./assets/ineosauto-removebg-preview.png";
import cvPdf from "./assets/CV_2025-11-23_Alexandre_Garing.pdf";

const assetModules = import.meta.glob("./assets/*", { eager: true, import: "default" });

function getAsset(fileName) {
  return assetModules[`./assets/${fileName}`] ?? null;
}

function Icon({ children, className = "" }) {
  return (
    <span className={`inline-flex h-5 w-5 items-center justify-center text-[var(--color-accent)] ${className}`}>
      {children}
    </span>
  );
}

const icons = {
  shield: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M12 3 5 6v6c0 4.3 2.7 7.9 7 9 4.3-1.1 7-4.7 7-9V6l-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m9.5 12 1.8 1.8 3.2-3.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  cloud: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path d="M7.5 18a4.5 4.5 0 1 1 .9-8.9 5.4 5.4 0 0 1 10.4 2.1A3.8 3.8 0 1 1 19 18H7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 10V8a3.5 3.5 0 1 1 7 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
      <path d="m20 20-4.2-4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  ),
};

function Section({ title, subtitle, icon, children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-sm transition-colors duration-300 hover:border-[var(--color-border-strong)] sm:p-7 ${className}`}>
      <div className="mb-5 space-y-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[var(--color-text)] sm:text-xl">
          {icon}
          {title}
        </h2>
        {subtitle && <p className="text-sm text-[var(--color-text-muted)]">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Pill({ children }) {
  return <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-soft)] transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]">{children}</span>;
}

function LinkButton({ href, children, primary = false, download = false }) {
  return (
    <a
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/40 ${
        primary
          ? "border-[var(--color-accent)]/70 bg-[var(--color-accent-soft)] text-[var(--color-text)] hover:bg-[var(--color-accent)]/30"
          : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)]"
      }`}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      download={download ? "Alexandre_Garing_CV.pdf" : undefined}
    >
      {children}
    </a>
  );
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-soft)] shadow-[0_2px_10px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/55 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.9" />
          <path d="M12 2.5v2.3M12 19.2v2.3M21.5 12h-2.3M4.8 12H2.5M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6M18.7 18.7l-1.6-1.6M6.9 6.9 5.3 5.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function ExpCard({ title, when, where, bullets }) {
  return (
    <article className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-soft)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text)] sm:text-base">{title}</h3>
          <p className="mt-1 text-xs text-[var(--color-text-muted)] sm:text-sm">{where}</p>
        </div>
        <span className="w-fit rounded-full border border-[var(--color-accent)]/35 bg-[var(--color-accent-soft)] px-3 py-1 text-xs text-[var(--color-text)]">{when}</span>
      </div>
      <ul className="mt-4 space-y-2 pl-4 text-sm leading-relaxed text-[var(--color-text-soft)] marker:text-[var(--color-accent)]/70">
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
    <article className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/50">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex justify-center sm:justify-start">
          <img src={image} alt={`${title} certification badge`} className="h-[96px] w-auto object-contain sm:h-[116px]" loading="lazy" />
        </div>
        <div className="flex-1 space-y-3">
          <h3 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">{title}</h3>
          <div className="h-px w-full bg-gradient-to-r from-[var(--color-accent)]/50 via-[var(--color-border)] to-transparent" />
          <p className="text-sm leading-relaxed text-[var(--color-text-soft)]">{description}</p>
          <a href={verificationLink} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-[var(--color-accent)]/60 bg-[var(--color-accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50">
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

const toolingLogos = [
  { name: "Microsoft Sentinel", logo: getAsset("Microsoft_Sentinel.png") },
  { name: "Microsoft Entra ID", logo: getAsset("Microsoft_Entra_ID_color_icon.svg.png") },
  { name: "Microsoft Azure", logo: getAsset("Microsoft-Azure.png") },
  { name: "Microsoft Defender", logo: getAsset("Microsoft_Defender_2020_Fluent_Design_icon.svg.png") },
]
  .filter((tool) => Boolean(tool.logo))
  .filter((tool, index, array) => array.findIndex((item) => item.logo === tool.logo) === index);

const skillTags = [
  { label: "Microsoft Sentinel", icon: icons.target },
  { label: "Microsoft Defender XDR", icon: icons.shield },
  { label: "KQL Hunting & Investigations", icon: icons.search },
  { label: "MITRE ATT&CK Detection Engineering", icon: icons.target },
  { label: "Entra ID", icon: icons.lock },
  { label: "Conditional Access & MFA", icon: icons.lock },
  { label: "Defender for Cloud Apps", icon: icons.cloud },
  { label: "Defender for Cloud (CSPM)", icon: icons.cloud },
  { label: "Logic Apps / Playbooks", icon: icons.cloud },
  { label: "Tenable IO / One", icon: icons.shield },
  { label: "ServiceNow / ITSM", icon: icons.shield },
  { label: "PowerShell & Python", icon: icons.search },
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
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const hasSavedTheme = savedTheme === "dark" || savedTheme === "light";

    let initialTheme = "dark";
    if (hasSavedTheme) {
      initialTheme = savedTheme;
    } else if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      initialTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    setTheme(initialTheme);
  }, []);

  function toggleTheme() {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem("theme", next);
      return next;
    });
  }

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
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-[8%] h-72 w-72 rounded-full bg-[var(--color-accent)]/15 blur-3xl" />
        <div className="absolute right-[5%] top-[18%] h-80 w-80 rounded-full bg-[var(--color-ambient)] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <header className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-soft)] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.2)] sm:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Portfolio · Cloud Security</p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-[var(--color-text)] sm:text-5xl">
                Alexandre Garing
                <span className="mt-2 block text-xl font-medium text-[var(--color-text-soft)] sm:text-3xl">Microsoft Cloud Security Engineer</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-base">
                J’accompagne la sécurisation d’environnements Azure et Entra ID (Zero Trust) : gouvernance d’identité, durcissement, posture cloud, et capacité de détection/réponse avec Microsoft Sentinel et Defender XDR.
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-muted)]">Grand Est, France · Hybride</p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 sm:gap-3 sm:px-4">
                {toolingLogos.map((tool) => (
                  <div key={tool.name} className="group inline-flex items-center rounded-xl border border-[var(--color-border)] bg-[var(--logo-card-bg)] px-3 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_0_18px_rgba(140,185,255,0.18)] sm:px-3.5">
                    <img src={tool.logo} alt={`${tool.name} logo`} className="h-7 w-auto object-contain sm:h-8 lg:h-10" loading="lazy" />
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <Pill>Microsoft Sentinel</Pill>
                <Pill>Defender XDR</Pill>
                <Pill>Entra ID</Pill>
                <Pill>KQL</Pill>
                <Pill>Logic Apps</Pill>
                <Pill>CSPM</Pill>
              </div>
            </div>

            <nav className="self-start lg:justify-end">
              <div className="flex flex-wrap items-center gap-2">
                <LinkButton href={cvPdf} download>
                  Download CV (PDF)
                </LinkButton>
                <LinkButton href="https://www.linkedin.com/in/alexandre-garing/">LinkedIn</LinkButton>
                <LinkButton href="https://github.com/Sudo-auke">GitHub</LinkButton>
                <LinkButton href="#contact" primary>
                  Contact
                </LinkButton>

                <div className="ml-1 h-7 w-px bg-[var(--color-border)]" aria-hidden="true" />
                <ThemeToggle theme={theme} onToggle={toggleTheme} />
              </div>
            </nav>
          </div>
        </header>

        <main className="mt-10 grid gap-6 lg:grid-cols-12">
          <Section title="Profil" icon={<Icon>{icons.shield}</Icon>} className="lg:col-span-5">
            <p className="text-sm leading-relaxed text-[var(--color-text-soft)] sm:text-[15px]">
              Spécialisé en sécurité Microsoft cloud (Azure & Entra ID), j’interviens sur la sécurisation globale des environnements : gouvernance des identités, durcissement des ressources, posture de sécurité cloud, protection des workloads et mise en place des capacités de détection et réponse avec Microsoft Defender et Sentinel. Certifié AZ-500 et SC-200, actuellement en préparation de la SC-100.
            </p>
          </Section>

          <Section title="Compétences clés" icon={<Icon>{icons.cloud}</Icon>} subtitle="Stack sécurité & opérations" className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {skillTags.map((skill) => (
                <span key={skill.label} className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-soft)] transition-all duration-300 hover:border-[var(--color-accent)]/45 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-text)]">
                  <Icon className="h-4 w-4">{skill.icon}</Icon>
                  {skill.label}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Expériences" icon={<Icon>{icons.target}</Icon>} subtitle="Parcours orienté sécurité opérationnelle" className="lg:col-span-12">
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:gap-4 sm:p-4">
              {experienceCompanies.map((company) => (
                <div key={company.name} className="flex h-[84px] min-w-[170px] items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--logo-card-bg)] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 hover:shadow-[0_0_24px_rgba(148,189,255,0.18)] sm:min-w-[190px]">
                  <img src={company.logo} alt={`${company.name} logo`} className="h-10 w-auto max-w-[160px] object-contain sm:h-11 md:h-12" loading="lazy" />
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
            <ul className="space-y-3 text-sm text-[var(--color-text-soft)]">
              <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">Mastère Expert ASR &amp; Sécurité Informatique — Metz Numeric School (oct. 2025 → sept. 2027)</li>
              <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">Bachelor Réseaux &amp; Cybersécurité (TSSR) — Metz Numeric School (2024 → sept. 2025)</li>
              <li className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">Licence Pro AQI &amp; BTS Contrôle industriel / régulation — Metz (2013 → 2016)</li>
            </ul>
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <img src={schoolLogo} alt="Metz Numeric School logo" className="h-9 w-9 rounded-md object-cover opacity-95" loading="lazy" />
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">Education</p>
                <p className="text-sm text-[var(--color-text-soft)]">Metz Numeric School — Cybersecurity track</p>
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
            <ul className="space-y-2 text-sm text-[var(--color-text-soft)]">
              <li>Français (natif), Anglais (C1), Allemand (B2)</li>
              <li>Centres d’intérêt : cybersécurité, moto/auto, horlogerie, VTT, fitness</li>
            </ul>
          </Section>

          <Section title="Contact" subtitle="Formulaire relié à Firestore · collection contacts" className="lg:col-span-7">
            <div id="contact">
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-medium text-[var(--color-text-muted)]">
                    Nom
                    <input className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-300 focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20" name="name" value={form.name} onChange={onChange} placeholder="Votre nom" autoComplete="name" />
                  </label>

                  <label className="text-xs font-medium text-[var(--color-text-muted)]">
                    Email
                    <input className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-300 focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20" name="email" value={form.email} onChange={onChange} placeholder="votre@email.com" autoComplete="email" />
                  </label>
                </div>

                <label className="block text-xs font-medium text-[var(--color-text-muted)]">
                  Message
                  <textarea className="mt-1.5 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] px-3.5 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-all duration-300 focus:border-[var(--color-accent)]/60 focus:ring-2 focus:ring-[var(--color-accent)]/20" name="message" value={form.message} onChange={onChange} placeholder="Votre message…" rows={5} />
                </label>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button className="rounded-full border border-[var(--color-accent)]/45 bg-[var(--color-accent-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--color-text)] transition-all duration-300 hover:border-[var(--color-accent)]/70 hover:bg-[var(--color-accent)]/25 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading} type="submit">
                    {loading ? "Envoi..." : "Envoyer"}
                  </button>

                  {status.type !== "idle" && <p className={status.type === "success" ? "text-xs text-emerald-500" : "text-xs text-rose-500"}>{status.text}</p>}
                </div>
              </form>
            </div>
          </Section>
        </main>

        <footer className="mt-8 text-center text-xs text-[var(--color-text-muted)]">© {year} Alexandre Garing</footer>
      </div>
    </div>
  );
}
