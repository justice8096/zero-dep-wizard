# zero-dep-wizard

A zero-dependency browser-based wizard/form framework with built-in state persistence, theming, and file I/O.

## Features

- **Zero dependencies** — Pure vanilla JavaScript, no npm packages required
- **Multi-step forms** — Create wizards with progress indicators and navigation
- **State persistence** — Auto-save to sessionStorage, with manual load/save to files
- **Theming** — Configurable CSS with light and dark themes included
- **DOM helpers** — Simple element creation, form inputs, alerts, and sections
- **File I/O** — Load/save JSON configs, export markdown
- **Framework separation** — `createWizard()` is generic; use for onboarding, surveys, configuration, or any multi-step form

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

let appState = {
  step1: { name: '', email: '' },
  step2: { choice: null }
};

const wizard = createWizard({
  title: 'My Wizard',
  totalSteps: 2,
  stepLabels: ['Personal Info', 'Preferences'],
  stateKey: 'my-wizard',
  
  getState: () => appState,
  setState: (saved) => Object.assign(appState, saved),
  
  renderStep: (stepNum, container) => {
    if (stepNum === 0) {
      container.appendChild(createTextInput('Name:', appState.step1.name, 
        (v) => appState.step1.name = v));
    } else {
      container.appendChild(createToggle('Agree?', appState.step2.choice,
        (v) => appState.step2.choice = v));
    }
  },
  
  onSave: () => saveConfigToFile(appState),
  onLoad: () => loadConfigFromFile((s) => {
    Object.assign(appState, s);
    wizard.refreshStep();
  }),
  onExport: () => exportMarkdown('result.md', JSON.stringify(appState, null, 2))
});

wizard.render();
```

## State Management Pattern

The `createWizard()` framework uses a simple, two-way state binding pattern:

### 1. Define Your State Object

Create a plain JavaScript object with your form data:

```javascript
let formState = {
  personal: { name: '', email: '', age: null },
  preferences: { newsletter: false, theme: 'light' },
  agreement: { accepted: false }
};
```

### 2. Provide `getState()` and `setState()` Callbacks

These allow the wizard to read and restore your state:

```javascript
const wizard = createWizard({
  // ... other options ...
  stateKey: 'my-form',
  
  // Called by wizard before auto-saving to sessionStorage
  getState: () => formState,
  
  // Called by wizard when restoring from sessionStorage
  setState: (savedState) => {
    Object.assign(formState, savedState);
  }
});
```

### 3. Update State in `renderStep()`

When rendering each step, bind your form controls to the state and update it on user input:

```javascript
renderStep: (stepNum, container) => {
  if (stepNum === 0) {
    // Render with current state value
    container.appendChild(
      createTextInput(
        'Full Name:',
        formState.personal.name,
        (value) => {
          formState.personal.name = value;  // Update on change
        }
      )
    );
  }
}
```

### How It Works

1. **Initial render**: `wizard.render()` calls `setState()` to restore any saved state from sessionStorage
2. **User input**: As the user types/clicks, your state object updates immediately via the callbacks
3. **Auto-save**: Every 300ms while the user is typing, `getState()` is called and the result is saved to sessionStorage
4. **Manual save**: `wizard.saveNow()` or the "Save Config" button saves immediately
5. **Page reload**: On page refresh, `setState()` restores the user's progress

### State Persistence Flow

```
User Input → Update formState → (300ms) → getState() → sessionStorage
                                                    ↓
Page Load → sessionStorage → setState(savedState) → formState restored
```

### Advanced: Manual State Synchronization

If you need more control, skip `getState`/`setState`:

```javascript
const wizard = createWizard({
  title: 'Custom State',
  totalSteps: 2,
  stepLabels: ['Step 1', 'Step 2'],
  // No stateKey, getState, or setState
  renderStep: (stepNum, container) => {
    // ... render your UI ...
  }
});

// Manually save/load as needed
wizard.saveNow();
let currentStep = wizard.getCurrentStep();
wizard.setStep(2);
```

## API Reference

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

## Examples

This library works for any multi-step form. See the `examples/` directory:

- **survey.html** — Simple 3-step survey with name, experience, and feedback
- **onboarding.html** — User onboarding with personal info, preferences, and agreements
- **configuration.html** — Application configuration wizard with database, cache, logging, and security settings

All examples use the same `createWizard()` framework with different state shapes and themes.

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
  .progress-dot { width: 14px; height: 14px; }
`;
injectCSS(customCSS);
```

## Browser Support

Works in all modern browsers that support:
- ES6 modules
- sessionStorage
- Fetch API (for file downloads)

## Testing

Run tests with vitest:

```bash
npm test
```

Tests cover:
- Element creation and DOM manipulation
- Form input helpers
- State persistence and restoration
- Wizard navigation and lifecycle
- State management patterns

## License

MIT © 2026 Justice E. Chase
