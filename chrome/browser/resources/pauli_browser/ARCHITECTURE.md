# PAULI Browser Architecture

## Overview

PAULI Browser is built as a custom layer on top of Chromium, integrating directly into the browser's resource system while maintaining clean separation from core Chromium code.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PAULI Browser UI Layer                   │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │ Dashboard  │  │ Command       │  │ Voice Interface   │   │
│  │ (React)    │  │ Palette       │  │ (STT/TTS)        │   │
│  └─────┬──────┘  └──────┬───────┘  └────────┬──────────┘   │
│        │                 │                    │              │
│        └─────────────────┴────────────────────┘              │
│                          │                                   │
│              ┌───────────▼───────────┐                       │
│              │   Agent Bridge        │                       │
│              │   (Orchestration)     │                       │
│              └───────────┬───────────┘                       │
└──────────────────────────┼───────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌──────▼───────┐ ┌────────▼──────┐
│ GitHub API     │ │ Notion API    │ │ PAULI-PRIME   │
│ Connector      │ │ Connector     │ │ Orchestrator  │
└────────────────┘ └───────────────┘ └───────────────┘
        │                  │                  │
        └──────────────────┴──────────────────┘
                           │
                  ┌────────▼────────┐
                  │  Triple-Sync    │
                  │  Engine         │
                  └─────────────────┘
```

## Component Details

### 1. Dashboard (React UI)

**Location**: `chrome/browser/resources/pauli_browser/dashboard/`

The dashboard replaces the standard New Tab Page with a developer-focused interface.

**Key Components**:
- `DashboardApp`: Main React application
- `WorkspaceNavigation`: Tab-based workspace switcher
- `ProjectsList`: GitHub projects and repositories
- `TasksPanel`: Notion tasks and to-dos
- `SyncStatusIndicator`: Triple-sync health visualization
- `AgentStatusPanel`: Running agent workflows

**State Management**:
- Uses React Query for API data caching
- Zustand for local UI state
- LocalStorage for user preferences

### 2. Command Palette

**Location**: `chrome/browser/resources/pauli_browser/command_palette/`

Universal command interface accessible via Cmd/Ctrl+K or voice.

**Components**:
- `CommandPalette`: Main UI component
- `CommandRegistry`: Available commands database
- `CommandExecutor`: Execution engine with approval gates
- `KeyboardShortcuts`: Hotkey handler

**Command Categories**:
1. **Auto-Execute**: Runs immediately (e.g., "open dashboard")
2. **Requires Approval**: Shows preview first (e.g., "commit changes")
3. **Hard Block**: Requires explicit confirmation (e.g., "deploy to production")

### 3. Voice Interface

**Location**: `chrome/browser/resources/pauli_browser/voice/`

Enables hands-free interaction with the browser.

**Components**:
- `SpeechRecognition`: STT integration wrapper
- `TextToSpeech`: TTS synthesis wrapper
- `VoiceCommandProcessor`: Converts speech to commands
- `AudioManager`: Handles audio streams

**Flow**:
1. User activates voice (push-to-talk or wake word)
2. Audio streamed to STT service (remote or local)
3. Transcribed text sent to command palette
4. Command executed with voice feedback
5. Result synthesized and played via TTS

### 4. Agent Bridge

**Location**: `chrome/browser/resources/pauli_browser/agent_bridge/`

Connects the browser UI to external agent orchestrators.

**Components**:
- `AgentClient`: WebSocket/HTTP client for agent communication
- `OrchestrationManager`: Manages multiple agent connections
- `StatusPoller`: Polls agent execution status
- `ResultHandler`: Processes agent results and updates UI

**Supported Orchestrators**:
- PAULI-PRIME: Primary agent coordinator
- LangGraph: Workflow orchestration
- Antigravity: Specialized task execution
- Custom MCP Servers: Extensible agent integrations

### 5. API Connectors

**Location**: `chrome/browser/resources/pauli_browser/api/`

Interfaces to external services.

**GitHub Connector** (`api/github/`):
- OAuth flow implementation
- REST API client for repos, PRs, issues
- GraphQL client for complex queries
- Webhook handler for real-time updates

**Notion Connector** (`api/notion/`):
- OAuth flow implementation
- Database query interface
- Page CRUD operations
- Real-time collaboration sync

**Google Drive Connector** (`api/gdrive/`):
- OAuth flow implementation
- File upload/download
- Archive management
- Metadata sync

### 6. Triple-Sync Engine

**Location**: `chrome/browser/resources/pauli_browser/sync/`

Maintains consistency across GitHub, Notion, and Google Drive.

**Components**:
- `SyncCoordinator`: Orchestrates sync operations
- `ConflictResolver`: Handles merge conflicts
- `StateTracker`: Monitors sync health
- `CacheManager`: Local mirror of remote state

**Sync Protocol**:
1. **Read**: Always from cache with freshness check
2. **Write**: 
   - Update local cache immediately
   - Mark as "pending sync"
   - Push to GitHub/Notion
   - Verify sync succeeded
   - Update status to "synced"
3. **Conflict**: 
   - Detect divergence
   - Present options to user
   - Apply resolution strategy
   - Re-sync

### 7. Remote Execution Interface

**Location**: `chrome/browser/resources/pauli_browser/remote/`

Enables offloading heavy tasks to cloud infrastructure.

**Components**:
- `SessionManager`: Manages remote browser sessions
- `GPUClient`: Interfaces with GPU servers
- `PlaywrightBridge`: HybridBrowserToolkit integration
- `JobQueue`: Manages pending remote tasks

**Execution Flow**:
1. User triggers remote task
2. Job queued with priority
3. Session spawned on Coolify/VPS
4. Task executed remotely
5. Results synced back via triple-sync
6. UI updated with artifacts

## Data Flow

### User Action → Agent Execution

```
User Input (UI/Voice)
    ↓
Command Palette
    ↓
Command Registry (lookup)
    ↓
Approval Gate Check
    ↓ (if approved)
Agent Bridge
    ↓
PAULI-PRIME / Orchestrator
    ↓
Agent Execution (remote)
    ↓
Results → Triple-Sync
    ↓
Cache Update
    ↓
UI Refresh
    ↓
TTS Report (optional)
```

### Sync Operation Flow

```
Local Change (e.g., task update)
    ↓
SyncCoordinator.queueChange()
    ↓
Update Local Cache (optimistic)
    ↓
Mark as "pending" in UI
    ↓
Push to GitHub/Notion API
    ↓
[Success]              [Failure]
    ↓                      ↓
Mark "synced"        Retry Logic
Update UI            Show Error
                     Offer Resolution
```

## Security Considerations

### Authentication
- All tokens stored in Chromium's secure storage (OS keychain)
- OAuth flows use PKCE for additional security
- Tokens refreshed automatically before expiry

### Sandboxing
- Each API connector runs in isolated context
- CDP ports only accessible with authentication
- WebSocket connections use WSS with certificate validation

### Data Privacy
- No telemetry sent to Google or third parties
- All analytics opt-in only
- Local-first approach: data cached locally, synced deliberately

## Performance Optimizations

### Lazy Loading
- Dashboard components loaded on-demand
- API connectors initialized when first used
- Voice services activated only when enabled

### Caching Strategy
- Aggressive caching of GitHub/Notion data
- Stale-while-revalidate pattern
- Incremental updates for large datasets

### Bundle Optimization
- Code splitting by feature
- Tree shaking of unused dependencies
- Minification and compression

## Extension Points

### Adding New Commands
1. Define command in `command_palette/commands/`
2. Register in `CommandRegistry`
3. Implement handler function
4. Add to documentation

### Adding New Agents
1. Create orchestrator client in `agent_bridge/orchestrators/`
2. Implement status polling
3. Add result parser
4. Register in `OrchestrationManager`

### Adding New Sync Targets
1. Create connector in `api/`
2. Implement sync protocol
3. Add to `SyncCoordinator`
4. Update status indicators

## Testing Strategy

### Unit Tests
- Component tests with React Testing Library
- API connector mocks
- Command execution tests

### Integration Tests
- E2E tests with Playwright
- GitHub/Notion API integration tests
- Voice command flow tests

### Manual Testing
- Browser smoke tests
- Voice interaction testing
- Sync conflict scenarios

## Build & Deployment

### Build Configuration
- GN build files in `chrome/browser/resources/pauli_browser/BUILD.gn`
- TypeScript compilation via `tsconfig.json`
- React bundling with Rollup

### Distribution
- Chromium builds with PAULI customizations baked in
- Optional: Electron/Tauri wrapper for standalone distribution
- Installers for macOS, Windows, Linux

### Updates
- Chrome-style auto-update mechanism
- Feature flags for gradual rollout
- Rollback capability for critical issues

## Future Enhancements

1. **Offline Mode**: Full functionality without internet
2. **Multi-User**: Shared workspaces and collaboration
3. **Plugin System**: Third-party extensions
4. **Mobile Version**: iOS/Android companion apps
5. **AI Models**: Local LLM integration for privacy

## References

- [Chromium Architecture](https://www.chromium.org/developers/design-documents/)
- [React Best Practices](https://react.dev/learn)
- [PAULI System Design](https://github.com/executiveusa/pauli-comic-funnel/)
