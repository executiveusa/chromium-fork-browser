# Development Guide

## Setup

### Initial Setup

```bash
# Navigate to the PAULI Browser directory
cd chrome/browser/resources/pauli_browser

# Install Node.js dependencies
npm install

# Build TypeScript files
npm run build

# Or watch for changes during development
npm run watch
```

### Chromium Build

After making changes to PAULI Browser resources, rebuild Chromium:

```bash
# From the Chromium root directory
autoninja -C out/Default chrome
```

## Development Workflow

### 1. Adding a New Dashboard Component

1. Create component file in `dashboard/components/`:
   ```typescript
   // dashboard/components/MyComponent.tsx
   import React from 'react';
   
   export const MyComponent: React.FC = () => {
     return <div>My Component</div>;
   };
   ```

2. Import and use in dashboard app:
   ```typescript
   // dashboard/DashboardApp.tsx
   import { MyComponent } from './components/MyComponent';
   ```

3. Rebuild and test:
   ```bash
   npm run build
   autoninja -C ../../../../.. out/Default chrome
   ```

### 2. Adding a New Command

1. Create command file in `command_palette/commands/`:
   ```typescript
   // command_palette/commands/my_command.ts
   import { Command, CommandCategory } from '../types';
   
   export const myCommand: Command = {
     id: 'my-command',
     name: 'My Command',
     description: 'Does something useful',
     category: CommandCategory.AutoExecute,
     handler: async () => {
       // Implementation
     },
     shortcut: 'Ctrl+Shift+M',
   };
   ```

2. Register in `command_palette/registry.ts`:
   ```typescript
   import { myCommand } from './commands/my_command';
   
   export const commands = [
     // ... existing commands
     myCommand,
   ];
   ```

### 3. Adding a New API Connector

1. Create connector in `api/`:
   ```typescript
   // api/my_service/client.ts
   export class MyServiceClient {
     private token: string;
     
     constructor(token: string) {
       this.token = token;
     }
     
     async fetchData() {
       // Implementation
     }
   }
   ```

2. Add authentication flow if needed:
   ```typescript
   // api/my_service/auth.ts
   export async function authenticateMyService(): Promise<string> {
     // OAuth or token flow
   }
   ```

3. Use in dashboard or commands:
   ```typescript
   import { MyServiceClient } from '../api/my_service/client';
   
   const client = new MyServiceClient(token);
   const data = await client.fetchData();
   ```

### 4. Integrating a New Agent

1. Create orchestrator client in `agent_bridge/orchestrators/`:
   ```typescript
   // agent_bridge/orchestrators/my_agent.ts
   import { AgentClient } from '../client';
   
   export class MyAgentOrchestrator extends AgentClient {
     async execute(command: string, params: any) {
       // Send command to agent
       // Poll for status
       // Return results
     }
   }
   ```

2. Register in `agent_bridge/manager.ts`:
   ```typescript
   import { MyAgentOrchestrator } from './orchestrators/my_agent';
   
   orchestrationManager.register('my-agent', new MyAgentOrchestrator());
   ```

## Testing

### Unit Tests

```bash
# Run TypeScript unit tests
npm test
```

### Integration Tests

```bash
# From Chromium root
python3 testing/scripts/run_integration_tests.py --test-filter="PauliBrowser*"
```

### Manual Testing

1. Build Chromium with your changes
2. Launch browser: `out/Default/chrome`
3. Open new tab to see PAULI dashboard
4. Test command palette: Press Cmd/Ctrl+K
5. Check developer console for errors

## Code Style

### TypeScript

- Use functional components for React
- Prefer `const` over `let`
- Use async/await over promises
- Add JSDoc comments for public APIs
- Use descriptive variable names

### File Naming

- Components: `MyComponent.tsx` (PascalCase)
- Utilities: `my_utility.ts` (snake_case)
- Constants: `CONSTANTS.ts` (UPPERCASE)
- Types: `types.ts` or inline with implementation

### Project Structure

```
pauli_browser/
├── dashboard/
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── DashboardApp.tsx # Main app component
│   └── styles.css       # Global styles
├── command_palette/
│   ├── commands/        # Command implementations
│   ├── CommandPalette.tsx
│   ├── registry.ts
│   └── types.ts
├── api/
│   ├── github/
│   ├── notion/
│   └── gdrive/
└── ...
```

## Debugging

### Browser Console

All console logs from the dashboard appear in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Console tab
3. Filter for "PAULI" to see custom logs

### TypeScript Errors

```bash
# Check for type errors
npm run build

# Or use watch mode
npm run watch
```

### React DevTools

Install React DevTools extension to inspect component state and props.

## Performance

### Bundle Size

Check bundle size after changes:
```bash
# Build and check dist/ folder
npm run build
ls -lh dist/
```

### Lazy Loading

Load expensive components on demand:
```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

### Caching

Use React Query for API data caching:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['github', 'prs'],
  queryFn: () => githubClient.fetchPRs(),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Troubleshooting

### Build Fails

1. Clear build cache:
   ```bash
   rm -rf dist/ node_modules/
   npm install
   npm run build
   ```

2. Check TypeScript errors:
   ```bash
   npx tsc --noEmit
   ```

### Dashboard Not Showing

1. Check new tab page is loaded:
   - Navigate to `chrome://new-tab-page/`
   - Check console for errors

2. Verify BUILD.gn includes resources:
   ```python
   # Check BUILD.gn has pauli_browser resources
   ```

3. Rebuild Chromium:
   ```bash
   autoninja -C out/Default chrome
   ```

### API Not Connecting

1. Check authentication tokens:
   ```typescript
   // Add logging
   console.log('Token:', token ? 'present' : 'missing');
   ```

2. Verify CORS settings for remote APIs

3. Check network tab in DevTools for failed requests

## Contributing

1. Create feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make changes following code style

3. Test thoroughly:
   - Run unit tests
   - Manual testing in browser
   - Check console for errors

4. Commit with descriptive message:
   ```bash
   git commit -m "Add: My feature description"
   ```

5. Submit pull request with:
   - Description of changes
   - Screenshots if UI changes
   - Test results

## Resources

- [Chromium Development](https://www.chromium.org/developers/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [PAULI Architecture](./ARCHITECTURE.md)
