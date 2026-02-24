import { useMemo, useState } from "react";
import "./App.css";

import { db } from "./firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ type: "idle", text: "" });
  const [loading, setLoading] = useState(false);

  const year = useMemo(() => new Date().getFullYear(), []);

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
    <div className="shell">
      <header className="hero">
        <div className="heroTop">
          <div className="heroTitle">
            <h1>Alexandre Garing</h1>
            <p className="role">Cloud Security Engineer — Microsoft (SOC / XDR)</p>
            <p className="location">Grand Est, France · Hybride</p>
          </div>

          <nav className="cta">
            <a className="btn" href="https://www.linkedin.com/in/alexandre-garing/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="btn" href="https://github.com/Sudo-auke" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="btn btnPrimary" href="#contact">
              Contact
            </a>
          </nav>
        </div>

        <div className="heroBar">
          <div className="pill">Microsoft Sentinel</div>
          <div className="pill">Defender XDR</div>
          <div className="pill">Entra ID</div>
          <div className="pill">KQL</div>
          <div className="pill">Logic Apps</div>
          <div className="pill">CSPM</div>
        </div>
      </header>

      <main className="layout">
        <section className="card">
          <h2>Profil</h2>
          <p className="lead">
            Cloud security &amp; monitoring (Sentinel SIEM, Microsoft Defender XDR), investigations KQL, amélioration de la
            couverture de détection (MITRE ATT&amp;CK), gouvernance d’identités (Entra ID), automatisation (Logic Apps /
            playbooks) et posture (Defender for Cloud / CSPM).
          </p>
        </section>

        <section className="card">
          <h2>Compétences clés</h2>
          <ul className="list">
            <li>Microsoft Sentinel : ingestion, connectors, analytics rules, UEBA, investigations KQL, hunting</li>
            <li>Microsoft Defender XDR : triage, correlation, incidents (Identity/Endpoint/Email/Cloud Apps)</li>
            <li>Entra ID : MFA, Conditional Access, analyse des sign-in anomalies, principes Zero Trust</li>
            <li>Defender for Cloud Apps : shadow IT, OAuth apps, policy enforcement</li>
            <li>Vulnérabilités : Tenable IO/One, priorisation, attack paths, suivi remédiation</li>
            <li>ITSM / Tickets : ServiceNow, Freshservice, GLPI</li>
            <li>Scripting : PowerShell, Python, VBA</li>
          </ul>
        </section>

        <section className="card spanAll">
          <div className="cardHead">
            <h2>Expériences</h2>
          </div>

          <div className="xpGrid">
            <article className="xpItem">
              <div className="xpTop">
                <h3>Air Cloud — Cloud Security Engineer (alternance)</h3>
                <span className="tag">oct. 2025 → aujourd’hui</span>
              </div>
              <p className="muted">Grand Est (Hybride)</p>
              <ul className="list">
                <li>Déploiement Microsoft Sentinel : ingestion, règles, automatisation Logic Apps/playbooks</li>
                <li>Investigations KQL, hunting ciblé, détections alignées MITRE ATT&amp;CK</li>
                <li>Supervision Microsoft 365 Defender XDR : signaux identité/endpoints/email/cloud</li>
                <li>Entra ID : MFA/Conditional Access, analyse événements d’authentification sensibles</li>
                <li>Defender for Cloud Apps + Defender for Cloud (CSPM) : gouvernance et durcissement</li>
              </ul>
            </article>

            <article className="xpItem">
              <div className="xpTop">
                <h3>INEOS Automotive — IT Security Analyst (alternance)</h3>
                <span className="tag">oct. 2024 → nov. 2025</span>
              </div>
              <p className="muted">Hambach (Grand Est)</p>
              <ul className="list">
                <li>Vulnerability management : Tenable IO/One, priorisation, patch coordination, VRB</li>
                <li>SOC : alerting Taegis XDR, investigations (corrélation, logs), support niveau 1.5/2</li>
                <li>Réponse EDR : Carbon Black (quarantaine, scans, remote response)</li>
                <li>DNS filtering : déploiement Cisco Umbrella + supervision</li>
                <li>Gouvernance : préparation NIS2, audits, CAB, sensibilisation &amp; phishing internes</li>
              </ul>
            </article>

            <article className="xpItem">
              <div className="xpTop">
                <h3>Technology &amp; Strategy (client Bosch) — Validation &amp; Verification / Test Engineer</h3>
                <span className="tag">juin 2022 → mai 2024</span>
              </div>
              <p className="muted">Stuttgart (DE)</p>
              <ul className="list">
                <li>Lead technique validation ADAS / ParkPilot (projet client)</li>
                <li>Mesures et analyse : CANape, CANoe, CANalyzer</li>
                <li>Tests véhicules piste/route, mentorat et formation</li>
              </ul>
            </article>

            <article className="xpItem">
              <div className="xpTop">
                <h3>ArcelorMittal — Technicien mesures physiques / R&amp;D</h3>
                <span className="tag">2017 → 2022</span>
              </div>
              <p className="muted">Maizières-lès-Metz</p>
              <ul className="list">
                <li>Référent qualité équipements, suivi métrologie</li>
                <li>Mesures : métallographie, SEM, dureté, dilatométrie, essais thermo</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="card">
          <h2>Formations</h2>
          <ul className="list">
            <li>Mastère Expert ASR &amp; Sécurité Informatique — Metz Numeric School (oct. 2025 → sept. 2027)</li>
            <li>Bachelor Réseaux &amp; Cybersécurité (TSSR) — Metz Numeric School (2024 → sept. 2025)</li>
            <li>Licence Pro AQI &amp; BTS Contrôle industriel / régulation — Metz (2013 → 2016)</li>
          </ul>
        </section>

        <section className="card">
          <h2>Certifications</h2>
          <ul className="list">
            <li>AZ-500 — Microsoft Azure Security Engineer</li>
            <li>SC-200 — Microsoft Security Operations Analyst</li>
            <li>HTB CPTS (en cours)</li>
            <li>AWS Academy Cloud Foundations</li>
            <li>MOOC ANSSI / RGPD (CNIL)</li>
          </ul>
        </section>

        <section className="card spanAll">
          <div className="twoCols">
            <div>
              <h2>Langues &amp; intérêts</h2>
              <ul className="list">
                <li>Français (natif), Anglais (C1), Allemand (B2)</li>
                <li>Centres d’intérêt : cybersécurité, moto/auto, horlogerie, VTT, fitness</li>
              </ul>
            </div>

            <div id="contact">
              <h2>Contact</h2>
              <p className="muted">
                Formulaire relié à Firestore (Firebase). Les messages sont stockés dans la collection <code>contacts</code>.
              </p>

              <form onSubmit={onSubmit} className="form">
                <div className="row">
                  <label>
                    Nom
                    <input name="name" value={form.name} onChange={onChange} placeholder="Votre nom" autoComplete="name" />
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
                </div>

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

                <div className="formFooter">
                  <button className="btn btnPrimary" disabled={loading} type="submit">
                    {loading ? "Envoi..." : "Envoyer"}
                  </button>

                  {status.type !== "idle" && (
                    <p className={status.type === "success" ? "ok" : "err"}>{status.text}</p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <small>© {year} Alexandre Garing</small>
      </footer>
    </div>
  );
}
