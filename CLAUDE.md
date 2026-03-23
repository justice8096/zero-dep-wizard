# Zero-Dep Wizard

## Purpose
A lightweight, zero-dependency JavaScript framework for building multi-step wizard forms in the browser. Provides step navigation, session persistence, and a full set of UI primitives.

## Tools & Stack
- **Vanilla JavaScript** (no framework, no build tools)
- Zero external dependencies
- Zero innerHTML (XSS-safe DOM manipulation)

## Directory Structure
```
src/
  wizard.js              — createWizard() framework
  ui.js                  — UI primitives (el, createToggle, createSelect, etc.)
  css.js                 — Default theme (configurable)
  persistence.js         — sessionStorage auto-persist
examples/
  survey/                — Simple survey wizard example
  onboarding/            — User onboarding wizard example
```

## Key Concepts
- **Chrome vs Content separation**: Title, toolbar, progress, and navigation are built once. Only the step content area rebuilds on state changes — preserving in-progress text.
- **sessionStorage auto-persist**: Form state survives page reloads via stateKey/getState/setState.
- **Targeted DOM manipulation**: Toggle buttons use `display:none` toggling, not full re-renders.

## API
```javascript
const wizard = createWizard({
  title: 'My Wizard',
  subtitle: 'Step through the form',
  totalSteps: 3,
  stepLabels: ['Info', 'Preferences', 'Review'],
  stateKey: 'my-wizard',
  getState: () => state,
  setState: (saved) => Object.assign(state, saved),
  renderStep: (step, container) => { /* build step UI */ },
  onSave: () => saveConfigToFile(state),
  onExport: () => exportMarkdown('output.md', generateMarkdown(state)),
});
wizard.render();
```

## Technical Notes
- Default theme: navy #0B1426, amber #D4943A, teal #2A7B7B (configurable via CSS override)
- UI primitives: el(), createSection(), createToggle(), createSelect(), createTextInput(), createTextArea(), createAlert()
- Debounced auto-save (300ms) on any input event within the step container
- Progress dots: .active (current), .done (completed)
