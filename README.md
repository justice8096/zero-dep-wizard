# zero-dep-wizard

A zero-dependency browser-based wizard/form framework with built-in state persistence, theming, and file I/O.

## Features

- **Zero dependencies** — Pure vanilla JavaScript, no npm packages required
- **Multi-step forms** — Create wizards with progress indicators and navigation
- **State persistence** — Auto-save to sessionStorage, with manual load/save to files
- **Theming** — Configurable CSS with light and dark themes included
- **DOM helpers** — Simple element creation, form inputs, alerts, and sections
- **File I/O** — Load/save JSON configs, export markdown

## Installation

```bash
npm install zero-dep-wizard
```

Or use directly in HTML:

```html
<script type="module">
  import { createWizard, injectCSS } from './src/index.js';
  // ... your code
</script>
```

## Quick Start

```javascript
import { createWizard, injectCSS, DEFAULT_THEME } from 'zero-dep-wizard';

injectCSS(DEFAULT_THEME);

const wizard = createWizard({
  title: 'My Wizard',
  totalSteps: 3,
  stepLabels: ['Step 1', 'Step 2', 'Step 3'],
  stateKey: 'my-wizard',
  
  getState: () => appState,
  setState: (s) => { appState = s; },
  
  renderStep: (stepNum, container) => {
    if (stepNum === 0) {
      container.appendChild(el('h2', {}, ['First step']));
    } else if (stepNum === 1) {
      container.appendChild(el('h2', {}, ['Second step']));
    } else {
      container.appendChild(el('h2', {}, ['Third step']));
    }
  },
  
  onSave: () => { saveConfigToFile(appState); },
  onLoad: () => { loadConfigFromFile((s) => { appState = s; wizard.refreshStep(); }); },
  onExport: () => { exportMarkdown('result.md', generateMarkdown(appState)); }
});

wizard.render();
```

## API

### createWizard(options)

Creates a wizard controller.

**Options:**

```javascript
{
  title: 'Wizard Title',              // Required: page title
  subtitle: 'Optional subtitle',      // Optional
  totalSteps: 3,                      // Required: number of steps
  stepLabels: ['A', 'B', 'C'],       // Required: array of step names
  renderStep: (num, container) => {}, // Required: callback to render step content
  stateKey: 'my-wizard',             // Optional: sessionStorage key for auto-persist
  getState: () => state,             // Optional: callback to get current state
  setState: (s) => {},               // Optional: callback to restore state
  onSave: () => {},                  // Optional: "Save Config" button callback
  onLoad: () => {},                  // Optional: "Load Config" button callback
  onExport: () => {}                 // Optional: "Export Markdown" button callback
}
```

**Returns:**

```javascript
{
  render(),                 // Render the wizard into the DOM
  refreshStep(),           // Refresh current step after state change
  saveNow(),              // Force save state to sessionStorage
  getCurrentStep(),       // Get current step number
  setStep(n)              // Jump to step n
}
```

### DOM Helpers

```javascript
import { el, createSection, createToggle, createSelect, createTextInput, createTextArea, createAlert } from 'zero-dep-wizard';

el(tag, attrs, children)              // Create an element
createSection(title, [items])         // Create a titled section
createToggle(label, value, onChange)  // Yes/No toggle buttons
createSelect(label, options, value, onChange)  // Dropdown select
createTextInput(label, value, onChange, placeholder)  // Text input
createTextArea(label, value, onChange, placeholder)  // Textarea
createAlert(type, text)               // Alert box (info/success/warning/danger)
```

### State Persistence

```javascript
import { persistState, restoreState, persistStep, restoreStep } from 'zero-dep-wizard';

persistState(key, object)    // Save object to sessionStorage
restoreState(key)            // Retrieve object from sessionStorage (or null)
persistStep(key, stepNum)    // Save step number
restoreStep(key)             // Get step number (or 0)
```

### File I/O

```javascript
import { loadConfigFromFile, saveConfigToFile, exportMarkdown } from 'zero-dep-wizard';

loadConfigFromFile((config) => {})   // Open file dialog, parse JSON
saveConfigToFile(config)             // Download config as JSON
exportMarkdown(filename, content)    // Download content as markdown
```

### Theming

```javascript
import { injectCSS, DEFAULT_THEME, LIGHT_THEME } from 'zero-dep-wizard';

// Use default navy/amber/teal theme
injectCSS(DEFAULT_THEME);

// Use light theme
injectCSS(LIGHT_THEME);

// Custom theme
const customCSS = `
  body { background: #f0f0f0; color: #333; }
  .btn { background: #007bff; color: white; }
`;
injectCSS(customCSS);
```

## Themes

Two built-in themes are provided:

- **DEFAULT_THEME** — Dark navy background with amber and teal accents
- **LIGHT_THEME** — White background with green and teal accents

Both themes include styling for:
- Buttons, toggles, selects, inputs, textareas
- Alerts, badges, tables
- Progress indicators and navigation
- Responsive layout

## Example

See `examples/survey.html` for a complete 3-step survey example with state persistence and file I/O.

## CSS Classes

All generated elements use standard CSS classes you can customize:

```
.wizard, .btn, .btn.primary, .btn.success
.toggle-row, .toggle-label, .toggle-group, .toggle-btn
.field-row, .field-label, .field-input, .field-select, .field-textarea
.section, .alert, .alert.info/success/warning/danger
.progress, .progress-dot
.step-nav, .toolbar, .subtitle
```

Override or extend these classes with custom CSS:

```javascript
const customCSS = `
  .btn.primary { background: purple !important; }
  .field-input { font-size: 1.1em; }
`;
injectCSS(customCSS);
```

## Browser Support

Works in all modern browsers that support:
- ES6 modules
- sessionStorage
- Fetch API (for file downloads)

## License

MIT © 2026 Justice
