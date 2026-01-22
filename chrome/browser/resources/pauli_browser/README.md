# PAULI Browser

A developer-centric, AI-powered Chromium fork designed as the primary UI layer for the PAULI second-brain ecosystem.

## Overview

PAULI Browser is a customized Chromium-based browser that:
- Removes consumer-oriented bloat
- Embeds AI-assisted developer workflows
- Integrates tightly with GitHub, Notion, and remote execution
- Supports voice interactions and agentic workflows
- Maintains triple-sync integrity across GitHub, Notion, and Google Drive

## Architecture

### Layer 1: Voice & UI
The browser operates as Layer 1 within the PAULI 7-layer architecture. The UI does not contain business logic; it triggers tasks in PAULI-PRIME and skill orchestrators and reflects their state.

### Triple-Sync Protocol
- **GitHub**: Source of truth for code and configurations
- **Notion**: Stores operational context, tasks, and decisions
- **Google Drive**: Holds archives and artifacts
- **Local Cache**: Mirrors the remote state

The browser displays sync status and never commits changes locally without syncing back to GitHub/Notion.

## Key Features

### 1. Unified Developer Dashboard
- Custom start page with GitHub PRs, issues, and tasks
- Notion database integration for Projects, Tasks, Agents, Decisions
- Triple-sync status indicators (fresh/stale/out-of-sync)
- Tabbed workspaces for different contexts

### 2. GitHub Workflows
- OAuth authentication via GitHub connector
- File browsing and editing through GitHub API
- Pull request assistant with LLM-powered analysis
- Live commit with CI status monitoring

### 3. Notion-Powered Second Brain
- Rich editing with inline AI assistance
- Projects/Tasks/Agents database rendering
- Decisions and scripts quick retrieval
- Sync health indicators

### 4. Command Palette & Agent Orchestration
- Universal command palette (Cmd/Ctrl+K)
- Voice-to-text command input
- TTS reports for completed agent runs
- Agent status panel with running workflows

### 5. Remote Execution
- HybridBrowserToolkit integration for headless control
- GPU task offloading to cloud servers
- Session bridge for Playwright/MCP servers
- Automatic artifact syncing

### 6. Voice-First Interface
- Streaming speech-to-text
- Text-to-speech for agent reports
- Hands-free navigation mode
- Push-to-talk or wake-word detection

## Technical Stack

- **Browser Engine**: Chromium fork with telemetry removed
- **Shell**: Electron or Tauri for desktop packaging
- **Backend**: Node.js (TypeScript) for API integration
- **UI Framework**: React with Tailwind CSS
- **LLM Integration**: Multi-provider support (OpenAI, Anthropic, local models)
- **Voice Services**: External STT/TTS with local fallback
- **State Management**: React Query / Zustand

## Project Structure

```
chrome/browser/resources/pauli_browser/
├── README.md                 # This file
├── dashboard/                # Main dashboard implementation
│   ├── components/          # React components
│   ├── api/                 # GitHub, Notion API connectors
│   └── assets/              # Images, icons, styles
├── command_palette/          # Command palette implementation
├── voice/                    # Voice integration
├── agent_bridge/             # Agent orchestration interface
└── docs/                     # Additional documentation
```

## Getting Started

### Prerequisites
- Chromium build environment set up
- Node.js 18+ for backend services
- GitHub Personal Access Token
- Notion Integration Token (optional)

### Building
```bash
# Build Chromium with PAULI customizations
gn gen out/Default
autoninja -C out/Default chrome
```

### Running
```bash
# Launch PAULI Browser
out/Default/chrome
```

## Development

### Adding New Commands
Commands are registered in `command_palette/command_registry.ts`. Each command includes:
- Name and description
- Category (Auto-Execute, Requires Approval, Hard Block)
- Handler function
- Optional keyboard shortcut

### Integrating New Agents
Agent integrations go in `agent_bridge/orchestrators/`. Each agent needs:
- WebSocket or HTTP endpoint configuration
- Status polling mechanism
- Result handler

### Maintaining Triple-Sync
All state changes must go through:
1. Local update with pending indicator
2. GitHub commit or Notion update
3. Sync verification
4. Status indicator update

## Security

- All API secrets stored in secure keychain
- Site contexts isolated with sandboxing
- Remote code execution disabled by default
- CDP ports exposed only for authorized connections

## License

Same as Chromium - BSD-style license. See LICENSE file in repository root.

## References

- [Chromium Source](https://www.chromium.org)
- [PAULI System Memory](https://github.com/executiveusa/pauli-comic-funnel/blob/main/PAULI_SYSTEM_MEMORY.md)
- [Hybrid Browser Toolkit](https://github.com/executiveusa/pauli-comic-funnel/blob/main/eigent-main/backend/app/utils/toolkit/hybrid_browser_toolkit.py)
