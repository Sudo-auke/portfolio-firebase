import { useMemo, useState } from "react";
import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function Section({ title, children, className = "" }) {
  return (
    <section
      className={
        "rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.35)] " +
        "p-5 sm:p-6 " +
        className
      }
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight text-white/90">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/70">
      {children}
    </span>
  );
}

function ExpCard({ title, when, where, bullets }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-white/90">{title}</h3>
        <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-3 py-1 text-xs text-white/80">
          {when}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/60">{where}</p>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/80 marker:text-blue-200/70">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </article>
  );
}

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
    <div className="min-h-screen bg-[#0b0d10] text-white/90">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* HERO */}
        <header className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
                Alexandre Garing
              </h1>
              <p className="mt-2 text-sm text-white/80 sm:text-base">
                Cloud Security Engineer — Microsoft (SOC / XDR)
              </p>
              <p className="mt-1 text-sm text-white/60">Grand Est, France · Hybride</p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Pill>Microsoft Sentinel</Pill>
                <Pill>Defender XDR</Pill>
                <Pill>Entra ID</Pill>
                <Pill>KQL</Pill>
                <Pill>Logic Apps</Pill>
                <Pill>CSPM</Pill>
              </div>
            </div>

            <nav className="flex flex-wrap gap-2 sm:justify-end">
              <a
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.08]"
                href="https://www.linkedin.com/in/alexandre-garing/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.08]"
                href="https://github.com/Sudo-auke"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="rounded-full border border-blue-300/25 bg-blue-300/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-blue-300/20"
                href="#contact"
              >
                Contact
              </a>
            </nav>
          </div>
        </header>

        {/* CONTENT GRID */}
        <main className="mt-6 grid gap-4 lg:grid-cols-2">
          <Section title="Profil">
            <p className="text-sm leading-relaxed text-white/80">
              Cloud security &amp; monitoring (Sentinel SIEM, Microsoft Defender XDR), investigations KQL,
              amélioration de la couverture de détection (MITRE ATT&amp;CK), gouvernance d’identités (Entra ID),
              automatisation (Logic Apps / playbooks) et posture (Defender for Cloud / CSPM).
            </p>
          </Section>

          <Section title="Compétences clés">
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/80 marker:text-blue-200/70">
              <li>Microsoft Sentinel : ingestion, connectors, analytics rules, UEBA, investigations KQL, hunting</li>
              <li>Microsoft Defender XDR : triage, correlation, incidents (Identity/Endpoint/Email/Cloud Apps)</li>
              <li>Entra ID : MFA, Conditional Access, analyse des sign-in anomalies, principes Zero Trust</li>
              <li>Defender for Cloud Apps : shadow IT, OAuth apps, policy enforcement</li>
              <li>Vulnérabilités : Tenable IO/One, priorisation, attack paths, suivi remédiation</li>
              <li>ITSM / Tickets : ServiceNow, Freshservice, GLPI</li>
              <li>Scripting : PowerShell, Python, VBA</li>
            </ul>
          </Section>

          <Section title="Expériences" className="lg:col-span-2">
            <div className="grid gap-3 lg:grid-cols-2">
              <ExpCard
                title="Air Cloud — Cloud Security Engineer (alternance)"
                when="oct. 2025 → aujourd’hui"
                where="Grand Est (Hybride)"
                bullets={[
                  "Déploiement Microsoft Sentinel : ingestion, règles, automatisation Logic Apps/playbooks",
                  "Investigations KQL, hunting ciblé, détections alignées MITRE ATT&CK",
                  "Supervision Microsoft 365 Defender XDR : signaux identité/endpoints/email/cloud",
                  "Entra ID : MFA/Conditional Access, analyse événements d’authentification sensibles",
                  "Defender for Cloud Apps + Defender for Cloud (CSPM) : gouvernance et durcissement",
                ]}
              />
              <ExpCard
                title="INEOS Automotive — IT Security Analyst (alternance)"
                when="oct. 2024 → nov. 2025"
                where="Hambach (Grand Est)"
                bullets={[
                  "Vulnerability management : Tenable IO/One, priorisation, patch coordination, VRB",
                  "SOC : alerting Taegis XDR, investigations, support niveau 1.5/2",
                  "Réponse EDR : Carbon Black (quarantaine, scans, remote response)",
                  "DNS filtering : déploiement Cisco Umbrella + supervision",
                  "Gouvernance : préparation NIS2, audits, CAB, sensibilisation & phishing internes",
                ]}
              />
              <ExpCard
                title="Technology & Strategy (Bosch) — Validation & Verification / Test Engineer"
                when="juin 2022 → mai 2024"
                where="Stuttgart (DE)"
                bullets={[
                  "Lead technique validation ADAS / ParkPilot (projet client)",
                  "Mesures et analyse : CANape, CANoe, CANalyzer",
                  "Tests véhicules piste/route, mentorat et formation",
                ]}
              />
              <ExpCard
                title="ArcelorMittal — Technicien mesures physiques / R&D"
                when="2017 → 2022"
                where="Maizières-lès-Metz"
                bullets={[
                  "Référent qualité équipements, suivi métrologie",
                  "Mesures : métallographie, SEM, dureté, dilatométrie, essais thermo",
                ]}
              />
            </div>
          </Section>

          <Section title="Formations">
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/80 marker:text-blue-200/70">
              <li>Mastère Expert ASR &amp; Sécurité Informatique — Metz Numeric School (oct. 2025 → sept. 2027)</li>
              <li>Bachelor Réseaux &amp; Cybersécurité (TSSR) — Metz Numeric School (2024 → sept. 2025)</li>
              <li>Licence Pro AQI &amp; BTS Contrôle industriel / régulation — Metz (2013 → 2016)</li>
            </ul>
          </Section>

          <Section title="Certifications">
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/80 marker:text-blue-200/70">
              <li>AZ-500 — Microsoft Azure Security Engineer</li>
              <li>SC-200 — Microsoft Security Operations Analyst</li>
              <li>HTB CPTS (en cours)</li>
              <li>AWS Academy Cloud Foundations</li>
              <li>MOOC ANSSI / RGPD (CNIL)</li>
            </ul>
          </Section>

          <Section title="Langues & intérêts" className="lg:col-span-2">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <ul className="list-disc space-y-2 pl-5 text-sm text-white/80 marker:text-blue-200/70">
                  <li>Français (natif), Anglais (C1), Allemand (B2)</li>
                  <li>Centres d’intérêt : cybersécurité, moto/auto, horlogerie, VTT, fitness</li>
                </ul>
              </div>

              <div id="contact" className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <h3 className="text-sm font-semibold text-white/90">Contact</h3>
                <p className="mt-1 text-xs text-white/60">
                  Formulaire relié à Firestore (collection <code className="rounded bg-black/20 px-1 py-0.5">contacts</code>).
                </p>

                <form onSubmit={onSubmit} className="mt-4 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-xs text-white/70">
                      Nom
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90 outline-none focus:border-blue-200/40 focus:ring-2 focus:ring-blue-200/10"
                        name="name"
                        value={form.name}
                        onChange={onChange}
                        placeholder="Votre nom"
                        autoComplete="name"
                      />
                    </label>

                    <label className="text-xs text-white/70">
                      Email
                      <input
                        className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90 outline-none focus:border-blue-200/40 focus:ring-2 focus:ring-blue-200/10"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        placeholder="votre@email.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>

                  <label className="text-xs text-white/70">
                    Message
                    <textarea
                      className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/90 outline-none focus:border-blue-200/40 focus:ring-2 focus:ring-blue-200/10"
                      name="message"
                      value={form.message}
                      onChange={onChange}
                      placeholder="Votre message…"
                      rows={5}
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="rounded-full border border-blue-300/25 bg-blue-300/10 px-4 py-2 text-sm font-semibold text-white/90 hover:bg-blue-300/20 disabled:opacity-60"
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
            </div>
          </Section>
        </main>

        <footer className="mt-8 text-center text-xs text-white/50">
          © {year} Alexandre Garing
        </footer>
      </div>
    </div>
  );
}
