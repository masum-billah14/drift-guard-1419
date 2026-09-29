# DriftGuard

SecureAI — UI Requirements Analysis (v1: Demo Data Build)

Domain: InfraSphere AI → SecureAI | Competition: Idea to Unicorn (Team Project) Phase: UI shell only, with demo/mock data — no live AI backend yet

1. Product Framing (feed this context to Lovable)

Product name (placeholder): SecureAI — AI-Powered Security Operations Copilot One-liner: A real-time security monitoring dashboard where AI agents detect anomalies, explain their reasoning, and recommend/execute responses. Target users: SME IT/security teams who can't afford a full SOC (Security Operations Center). Design register: Enterprise security tool — trustworthy, calm-under-pressure, data-dense but legible. Not playful. Think: control room, not marketing site. Dark-mode-first (security tools conventionally default dark), high-contrast status colors (critical/high/medium/low), monospace accents for technical data (IPs, hashes, timestamps).

2. Why These Routes (source: guide Section 10.8)

The guide's Zero to Launch route structure is the most complete "enterprise-ready" checklist in the document. Adopting it for your I2U demo directly covers judging criteria from Section 11.1: Technical Excellence & Architecture, Business Value, Responsible AI/Data Sovereignty, and Presentation — all in one coherent site structure.

3. Full Route / Page List

Route Purpose Priority / Landing/overview — what the product is, CTA to demo High /app (dashboard) Main live monitoring view Core /app/incidents/:id Single incident detail + AI reasoning trail Core /demo-user One-click login as regular analyst user High /demo-admin One-click login as administrator High /admin User/role management, system settings Medium /architecture System/AI architecture diagram High (judging) /data Data sources, ingestion pipeline, vector DB explainer High (judging) /security Auth, encryption, privacy, compliance posture High (judging) /audit One-click audit report (security/privacy/governance) Medium /presentation Problem/solution/market/impact story page High (judging) /pitchdeck YC-style deck view Medium

4. Page-by-Page Requirements

4.1 / — Landing Page

Hero: problem statement in one sentence ("SMEs get breached because they can't afford 24/7 SOC teams")

Live-looking stat strip: threats detected today, avg response time, false-positive rate (demo numbers)

CTA buttons: "View Live Demo" → /demo-user, "Admin Demo" → /demo-admin

Short "How it works" 3-step visual (Event → AI Detection → Response)

4.2 /app — Main Dashboard (the core screen judges will spend the most time on)

Layout: 3-zone

Left sidebar: nav (Dashboard, Incidents, Agents, Data Sources, Settings), system status indicator (green/amber/red)

Main content:

Top row: KPI cards — Active Threats, Events Processed (last 24h), Mean Time to Detect, Mean Time to Respond

Live event stream table (mock): columns = Timestamp, Source, Event Type, Risk Score, Status, Action

Anomaly severity chart (time-series, last 24h) — critical/high/medium/low stacked

Right panel (optional): "AI Agent Activity Feed" — live log of what the detection/response agents are doing ("Agent flagged login from unusual IP — confidence 92%", "Response agent auto-blocked IP 41.x.x.x")

Demo data needed: ~30-50 mock security events (mix of normal + anomalous), 3-5 "open incidents," agent activity log entries

4.3 /app/incidents/:id — Incident Detail

Event summary card (what happened, when, source)

AI Reasoning panel — this is your differentiator, make it prominent:

"Why flagged" explanation in plain language

Confidence score

Similar past incidents (simulating vector DB retrieval results)

Severity classification

Recommended/taken action + status (Pending / Auto-resolved / Escalated)

Action buttons: Approve Response, Escalate, Mark False Positive

4.4 /demo-user & /demo-admin

Simple "Enter as Demo User/Admin" — no real auth, just routes into /app with role-appropriate view (admin sees /admin link in nav, user doesn't)

4.5 /admin

User table (name, role, last active) — mock data

System config toggles (mock): alert thresholds, auto-response on/off, integrations list

Agent management: list of active agents (Detector, Investigator, Responder) with status

4.6 /architecture

Diagram (can be static SVG/image for now): Event Source → Embedding → Vector DB lookup → LLM Reasoning Agent → Response Agent → Dashboard

Short text blocks explaining each layer

Tech stack labels (Gemini/Claude API, vector DB, etc.)

4.7 /data

Data sources list (mock): server logs, login events, transaction logs, network traffic

Explainer: how events become vectors, what's stored in the vector DB (past incidents, baselines)

Data retention/anonymization note (ties to Responsible AI)

4.8 /security

Auth method, encryption at rest/in transit (state your plan even if not implemented yet)

Data sovereignty statement (where data is stored/processed)

Compliance mentions (e.g., "designed with GDPR-aligned principles")

4.9 /audit

Mock "Generate Audit Report" button

Sample report sections: Security posture, Privacy compliance, Governance, Risk summary — with placeholder pass/fail indicators

4.10 /presentation

Problem → Solution → Users → Market → Impact, in narrative page form (this doubles as content for your video pitch)

4.11 /pitchdeck

Slide-style scroll or carousel: Problem, Solution, Market, Product, Traction (projected), Business Model, Team, Ask

5. Demo Data You Need to Prepare (for Lovable to consume as mock JSON)

events[] — id, timestamp, source_ip, event_type, risk_score, status

incidents[] — id, title, severity, ai_reasoning, confidence, recommended_action, status

agents[] — name, role (Detector/Investigator/Responder), status, last_action

users[] — name, role, last_active

kpis — active_threats, events_24h, mttd, mttr

6. Design Notes for the Lovable Prompt

Palette: dark base (near-black or deep navy), NOT the generic AI-dashboard purple gradient — consider a desaturated slate background with a single sharp accent (e.g., signal-red for critical, amber for warning) so severity colors actually mean something and aren't competing with a decorative accent

Typography: clean sans for UI (e.g., Inter), monospace for technical data (IPs, hashes, timestamps) to signal "real system" not "marketing site"

Avoid: generic dashboard templates with no real signal hierarchy — severity/status should be the loudest visual element on every screen

Responsive down to tablet at minimum (judges may view on laptop, but don't break on smaller screens)

7. What's Explicitly OUT of Scope for This First Build

Real AI/LLM calls (add in Phase 2)

Real vector DB / embeddings (add in Phase 2)

Real authentication (demo-user/demo-admin are just route shortcuts for now)

Real backend/API — all data can be static JSON/mock for this pass

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://drift-guard-1419.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aaad826e-baae-406b-8f7d-8d6dff424110).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
