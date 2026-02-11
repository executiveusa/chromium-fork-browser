# PAULI Dev Browser (Chromium Fork, Agent-Native)

## Role
You are a **senior platform engineer + browser engineer + agent systems architect** building an internal, developer-only, AI-native browser that acts as the control plane for autonomous agents, cloud workflows, and a second-brain system.

## Core Intent (Non-Negotiable)
Build a **Chromium-based browser fork** that is minimal, fast, stripped of consumer bloat, embeds **AI + agent workflows**, and acts as a **command-and-control interface** for GitHub, cloud runtimes, agent systems, and a second-brain. Supports **voice → agent → report → TTS** loops. The browser is a **control plane**, not an execution plane.

## Hard Architectural Boundaries
Enforce planes:
```
[ Browser UI / Control Plane ]
        ↓
[ Agent Gateway API ]
        ↓
[ Agent Runtimes (OpenHands, Agent Zero, etc.) ]
        ↓
[ Cloud Compute / GitHub / Infra ]
```
* Browser never runs agents directly or stores plaintext secrets.
* Browser never mutates code without GitHub events.

## Base Technology Decisions
* Fork Chromium. Strip consumer sync, ads, telemetry, password managers, shopping, media, games.
* Keep extensions (dev-only), devtools, CDP.
* Desktop shell only; mobile out of scope.

## Agent System: Universal Agent Contract (Mandatory)
All agents conform to:
```ts
interface AgentRun {
  id: string
  agent_type: "openhands" | "agent-zero" | "custom"
  goal: string
  context: { repo?: string; branch?: string; urls?: string[]; files?: string[] }
  status: "queued" | "running" | "blocked" | "completed" | "failed"
  artifacts: Artifact[]
  report: { summary: string; decisions: string[]; next_actions: string[]; files_changed?: string[] }
}
```

## Agent Gateway (Must Build)
Standalone service that accepts run requests, routes to agents, normalizes outputs into `AgentRun`, and emits lifecycle events.

Required endpoints:
```
POST   /agents/run
GET    /agents/:id
POST   /agents/:id/interrupt
POST   /agents/:id/approve
```

### Adapters
* **OpenHands**: task-oriented, short/medium runs, code-focused. `POST /agents/openhands/run`
* **Agent Zero**: long-running, autonomous, needs heartbeat/checkpoint/resume. `POST /agents/agent-zero/start`, `GET /agents/agent-zero/status/:id`

## Voice & TTS Loop (Strict)
Flow: Voice → Intent Classifier → Agent Dispatch → Agent completes → Report generated → TTS summary spoken.
* Agents never speak directly; only structured reports are voiced.

## Secrets & Credentials (Browser-Safe Vault)
* Secrets encrypted with WebCrypto; JS cannot read plaintext.
* Scoped by repo/agent/environment.
* Decryption only via Agent Gateway; supports rotation + audit log.
* Replaces `.env` and password managers.

## GitHub as Spine
* GitHub = source of truth; every agent action references commits, creates PRs, leaves comments.
* No silent mutations; no hidden state.
* Browser includes PR viewer, diff viewer, commit timeline, status checks.

## UI Philosophy (Minimal, Agenic)
* Not a dashboard. Core UI only: Command Palette (text + voice), Timeline (agent runs), Artifact Viewer, Repo Context Panel. Think “VS Code without an editor.” No clutter.

## Artifact System
* Agents output artifacts (files, diffs, links, dashboards, reports). Immutable, inspectable, first-class UI objects.

## Human-in-the-Loop Gates
* Explicit approvals required for merging, deployments, emails, deletions, secret changes. Approvals happen in-browser.

## Event Bus
* Everything emits events: agent_started, agent_blocked, agent_completed, pr_opened, secret_rotated. UI and agents subscribe. Loose coupling is mandatory.

## Failure is a Feature
* Browser must show failures clearly, explain why, and allow retry/fork/abandon.

## Kill Switches
* Per-agent kill, global pause, emergency secret revoke. Safety is mandatory.

## Definition of Done
Success when a developer can: say a goal, watch an agent execute remotely, approve a PR, hear a spoken report. No local compute required. GitHub history tells the full story. UI feels calm, powerful, inevitable.

## Delivery Expectations
Deliver repo structure, core services, browser fork config, Agent Gateway, and README explaining architecture/security/extension points. Do not over-optimize or add consumer UX.

## Final Directive
Build as if: future-self maintains it, agents are untrusted, developers rely on it daily, this becomes the nervous system of an AI studio. This is a control plane, not a toy.
