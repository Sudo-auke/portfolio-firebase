import { useState } from "react";
import "./App.css";

import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function App() {
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
    <div className="page">
      <header className="header">
        <div>
          <h1>Alexandre Garing</h1>
          <p className="subtitle">Cloud Security Engineer (SOC / XDR) — Microsoft</p>
          <p className="meta">Grand Est, France · Hybride</p>
        </div>

        <nav className="links">
          <a href="https://www.linkedin.com/in/alexandre-garing" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="https://github.com/Sudo-auke" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="grid">
        <section className="card">
          <h2>Profil</h2>
          <p>
            Cloud security & monitoring (Sentinel SIEM, Microsoft Defender XDR), investigations KQL,
            amélioration de la couverture de détection (MITRE ATT&amp;CK), gouvernance d’identités (Entra ID),
            automatisation (Logic Apps / playbooks) et posture (Defender for Cloud / CSPM).
          </p>
        </section>

        <section className="card">
          <h2>Compétences clés</h2>
          <ul>
            <li>Microsoft Sentinel : ingestion, connectors, analytics rules, UEBA, investigations KQL, hunting</li>
            <li>Microsoft Defender XDR : triage, correlation, incidents (Identity/Endpoint/Email/Cloud Apps)</li>
            <li>Entra ID : MFA, Conditional Access, analyse des sign-in anomalies, principes Zero Trust</li>
            <li>Defender for Cloud Apps : shadow IT, OAuth apps, policy enforcement</li>
            <li>Vulnérabilités : Tenable IO/One, priorisation, attack paths, suivi remédiation</li>
            <li>ITSM / Tickets : ServiceNow, Freshservice, GLPI</li>
            <li>Scripting : PowerShell, Python, VBA</li>
          </ul>
        </section>

        <section className="card">
          <h2>Expériences</h2>

          <div className="xp">
            <h3>Air Cloud — Cloud Security Engineer (alternance)</h3>
            <p className="meta">oct. 2025 → aujourd’hui · Grand Est (Hybride)</p>
            <ul>
              <li>Déploiement Microsoft Sentinel : ingestion, règles, automatisation Logic Apps/playbooks</li>
              <li>Investigations KQL, hunting ciblé, détections alignées MITRE ATT&amp;CK</li>
              <li>Supervision Microsoft 365 Defender XDR : signaux identité/endpoints/email/cloud</li>
              <li>Entra ID : MFA/Conditional Access, analyse événements d’authentification sensibles</li>
              <li>Defender for Cloud Apps + Defender for Cloud (CSPM) : gouvernance et durcissement</li>
            </ul>
          </div>

          <div className="xp">
            <h3>INEOS Automotive — IT Security Analyst (alternance)</h3>
            <p className="meta">oct. 2024 → nov. 2025 · Hambach (Grand Est)</p>
            <ul>
              <li>Vulnerability management : Tenable IO/One, priorisation, patch coordination, VRB</li>
              <li>SOC : alerting Taegis XDR, investigations (corrélation, logs), support niveau 1.5/2</li>
              <li>Réponse EDR : Carbon Black (quarantaine, scans, remote response)</li>
              <li>DNS filtering : déploiement Cisco Umbrella + supervision</li>
              <li>Gouvernance : préparation NIS2, audits, CAB, sensibilisation &amp; phishing internes</li>
            </ul>
          </div>

          <div className="xp">
            <h3>Technology &amp; Strategy (client Bosch) — Validation &amp; Verification / Test Engineer</h3>
            <p className="meta">juin 2022 → mai 2024 · Stuttgart (DE)</p>
            <ul>
              <li>Lead technique validation ADAS / ParkPilot (projet client)</li>
              <li>Mesures et analyse : CANape, CANoe, CANalyzer</li>
              <li>Tests véhicules piste/route, mentorat et formation</li>
            </ul>
          </div>

          <div className="xp">
            <h3>ArcelorMittal — Technicien mesures physiques / R&amp;D</h3>
            <p className="meta">2017 → 2022 · Maizières-lès-Metz</p>
            <ul>
              <li>Référent qualité équipements, suivi métrologie</li>
              <li>Mesures : métallographie, SEM, dureté, dilatométrie, essais thermo</li>
            </ul>
          </div>
        </section>

        <section className="card">
          <h2>Formations</h2>
          <ul>
            <li>Mastère Expert ASR &amp; Sécurité Informatique — Metz Numeric School (oct. 2025 → sept. 2027)</li>
            <li>Bachelor Réseaux &amp; Cybersécurité (TSSR) — Metz Numeric School (2024 → sept. 2025)</li>
            <li>Licence Pro AQI &amp; BTS Contrôle industriel / régulation — Metz (2013 → 2016)</li>
          </ul>
        </section>

        <section className="card">
          <h2>Certifications</h2>
          <ul>
            <li>AZ-500 — Microsoft Azure Security Engineer</li>
            <li>SC-200 — Microsoft Security Operations Analyst</li>
            <li>HTB CPTS (en cours)</li>
            <li>AWS Academy Cloud Foundations</li>
            <li>MOOC ANSSI / RGPD (CNIL)</li>
          </ul>
        </section>

        <section className="card">
          <h2>Langues &amp; intérêts</h2>
          <ul>
            <li>Français (natif), Anglais (C1), Allemand (B2)</li>
            <li>Centres d’intérêt : cybersécurité, moto/auto, horlogerie, VTT, fitness</li>
          </ul>
        </section>

        <section className="card" id="contact">
          <h2>Contact</h2>
          <p className="meta">
            Utilise ce formulaire. Je reçois les messages via Firestore (Firebase).
          </p>

          <form onSubmit={onSubmit} className="form">
            <label>
              Nom
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Votre nom"
                autoComplete="name"
              />
            </label>

            <label>
              Email
              <input
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="votre@email.com"
                autoComplete="email"
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                placeholder="Votre message…"
                rows={5}
              />
            </label>

            <button disabled={loading} type="submit">
              {loading ? "Envoi..." : "Envoyer"}
            </button>

            {status.type !== "idle" && (
              <p className={status.type === "success" ? "ok" : "err"}>{status.text}</p>
            )}
          </form>
        </section>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} Alexandre Garing</small>
      </footer>
    </div>
  );
}
