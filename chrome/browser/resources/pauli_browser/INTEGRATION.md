# PAULI Browser Integration Guide

This document explains how to integrate PAULI Browser into Chromium to replace the default New Tab Page.

## Overview

PAULI Browser is integrated as a WebUI resource in Chromium. It replaces the default New Tab Page with a custom developer-focused dashboard.

## Integration Steps

### 1. Build Configuration

The PAULI Browser resources are defined in `BUILD.gn`. To include them in the Chromium build:

**Add to `chrome/browser/resources/BUILD.gn`:**

```python
group("resources") {
  public_deps = [
    # ... existing deps ...
    "//chrome/browser/resources/pauli_browser:resources",
  ]
}
```

### 2. Register WebUI

Create a WebUI handler to serve PAULI Browser pages.

**Create `chrome/browser/ui/webui/pauli/pauli_ui.h`:**

```cpp
#ifndef CHROME_BROWSER_UI_WEBUI_PAULI_PAULI_UI_H_
#define CHROME_BROWSER_UI_WEBUI_PAULI_PAULI_UI_H_

#include "content/public/browser/web_ui_controller.h"

class PauliUI : public content::WebUIController {
 public:
  explicit PauliUI(content::WebUI* web_ui);
  PauliUI(const PauliUI&) = delete;
  PauliUI& operator=(const PauliUI&) = delete;
  ~PauliUI() override;
};

#endif  // CHROME_BROWSER_UI_WEBUI_PAULI_PAULI_UI_H_
```

**Create `chrome/browser/ui/webui/pauli/pauli_ui.cc`:**

```cpp
#include "chrome/browser/ui/webui/pauli/pauli_ui.h"

#include "chrome/browser/profiles/profile.h"
#include "chrome/common/webui_url_constants.h"
#include "chrome/grit/pauli_browser_resources.h"
#include "content/public/browser/web_ui.h"
#include "content/public/browser/web_ui_data_source.h"

PauliUI::PauliUI(content::WebUI* web_ui) : content::WebUIController(web_ui) {
  Profile* profile = Profile::FromWebUI(web_ui);
  content::WebUIDataSource* source = content::WebUIDataSource::CreateAndAdd(
      profile, chrome::kChromeUIPauliHost);

  // Add resources
  source->AddResourcePath("index.html", IDR_PAULI_BROWSER_INDEX_HTML);
  source->AddResourcePath("index.js", IDR_PAULI_BROWSER_INDEX_JS);
  source->SetDefaultResource(IDR_PAULI_BROWSER_INDEX_HTML);

  // Allow loading from chrome://pauli/
  source->OverrideContentSecurityPolicy(
      network::mojom::CSPDirectiveName::ScriptSrc,
      "script-src chrome://resources 'self';");
}

PauliUI::~PauliUI() = default;
```

### 3. Register URL Constants

**Add to `chrome/common/webui_url_constants.h`:**

```cpp
extern const char kChromeUIPauliHost[];
extern const char kChromeUIPauliURL[];
```

**Add to `chrome/common/webui_url_constants.cc`:**

```cpp
const char kChromeUIPauliHost[] = "pauli";
const char kChromeUIPauliURL[] = "chrome://pauli/";
```

### 4. Register WebUI Factory

**Modify `chrome/browser/ui/webui/chrome_web_ui_controller_factory.cc`:**

```cpp
#include "chrome/browser/ui/webui/pauli/pauli_ui.h"

// In GetWebUIType():
if (url.host_piece() == chrome::kChromeUIPauliHost) {
  return chrome::kChromeUIPauliHost;
}

// In CreateWebUIControllerForURL():
if (url.host_piece() == chrome::kChromeUIPauliHost) {
  return &NewWebUI<PauliUI>;
}
```

### 5. Replace New Tab Page (Optional)

To use PAULI Browser as the default New Tab Page:

**Modify `chrome/browser/ui/webui/ntp/new_tab_ui.cc`:**

```cpp
// Redirect to PAULI Browser
if (ShouldUsePauliBrowser(profile)) {
  web_ui->GetWebContents()->GetController().LoadURL(
      GURL(chrome::kChromeUIPauliURL),
      content::Referrer(),
      ui::PAGE_TRANSITION_AUTO_TOPLEVEL,
      std::string());
  return;
}
```

Or set the new tab page preference:

```cpp
// In user preferences
profile->GetPrefs()->SetString(
    prefs::kNewTabPageLocationOverride,
    chrome::kChromeUIPauliURL);
```

## Development Workflow

### Building

```bash
# From Chromium root
cd chrome/browser/resources/pauli_browser

# Install dependencies
npm install

# Build TypeScript
npm run build

# Build Chromium
cd ../../../../
autoninja -C out/Default chrome
```

### Running

```bash
# Launch Chromium with PAULI Browser
out/Default/chrome

# Or directly navigate to PAULI Browser
out/Default/chrome --new-window chrome://pauli/
```

### Debugging

1. Open Chrome DevTools (F12)
2. Navigate to Sources tab
3. Find `pauli_browser` resources
4. Set breakpoints and debug

## Feature Flags

To enable/disable PAULI Browser via feature flags:

**Add to `chrome/browser/about_flags.cc`:**

```cpp
const FeatureEntry::Choice kPauliBrowserChoices[] = {
    {flags_ui::kGenericExperimentChoiceDefault, "", ""},
    {"Enabled", switches::kEnablePauliBrowser, ""},
    {"Disabled", switches::kDisablePauliBrowser, ""},
};

{
  "pauli-browser",
  "Enable PAULI Browser",
  "Enables the PAULI developer-focused browser dashboard",
  kOsDesktop,
  FEATURE_VALUE_TYPE(features::kPauliBrowser)
},
```

## Configuration

PAULI Browser can be configured via:

### 1. Command-Line Flags

```bash
chrome --pauli-github-token="ghp_xxx" \
       --pauli-notion-token="secret_xxx" \
       --pauli-agent-endpoint="https://agent.example.com"
```

### 2. Preferences

Stored in user profile:

```json
{
  "pauli_browser": {
    "github_token": "encrypted_token",
    "notion_token": "encrypted_token",
    "agent_endpoints": {
      "pauli-prime": "https://pauli-prime.example.com"
    },
    "voice_enabled": true,
    "sync_interval": 300000
  }
}
```

### 3. Environment Variables

For development:

```bash
export PAULI_GITHUB_TOKEN="ghp_xxx"
export PAULI_NOTION_TOKEN="secret_xxx"
export PAULI_AGENT_ENDPOINT="https://agent.example.com"
```

## Security Considerations

### Token Storage

All API tokens are stored encrypted using Chromium's secure storage:

- **macOS**: Keychain
- **Windows**: DPAPI
- **Linux**: Secret Service API / libsecret

### Content Security Policy

PAULI Browser runs with restricted CSP:

```
script-src chrome://resources 'self';
style-src chrome://resources 'self' 'unsafe-inline';
img-src chrome://resources data: https:;
connect-src https://*.github.com https://*.notion.so https://*.googleapis.com wss:;
```

### Sandboxing

All API requests are made through the browser process with appropriate sandboxing.

## Testing

### Unit Tests

```bash
# Run PAULI Browser unit tests
npm test
```

### Integration Tests

```bash
# From Chromium root
out/Default/browser_tests --gtest_filter="PauliBrowser*"
```

### Manual Testing

1. Build Chromium with PAULI Browser
2. Launch: `out/Default/chrome`
3. Navigate to `chrome://pauli/`
4. Test features:
   - Dashboard loads
   - Workspace navigation works
   - Command palette opens (Cmd/Ctrl+K)
   - Sync status indicators show
   - Mock data displays

## Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
cd chrome/browser/resources/pauli_browser
npm run build
# Check for errors
```

**GN errors:**
```bash
gn gen out/Default
# Check for missing dependencies
```

### Runtime Errors

**Dashboard not loading:**
- Check DevTools console for errors
- Verify resources are built: `out/Default/pauli_browser_resources.pak`
- Check WebUI is registered: `chrome://chrome-urls/`

**API not connecting:**
- Verify tokens are set
- Check network tab for failed requests
- Ensure CORS is configured

## Next Steps

1. **Authentication**: Implement OAuth flows for GitHub/Notion/Drive
2. **Real Data**: Connect to actual APIs instead of mock data
3. **Agent Integration**: Configure real agent orchestrators
4. **Voice**: Test voice commands across platforms
5. **Sync**: Implement triple-sync engine
6. **Testing**: Add comprehensive test coverage

## References

- [Chromium WebUI Development](https://www.chromium.org/developers/webui-explainer/)
- [Chrome Extension APIs](https://developer.chrome.com/docs/extensions/reference/)
- [TypeScript in Chromium](https://chromium.googlesource.com/chromium/src/+/main/docs/typescript.md)
