---
name: zero-dep-wizard
description: Build multi-step browser-based assessment wizards with zero dependencies
version: 0.1.0
---

# Zero-Dep Wizard Framework Skill

Use this skill when the user wants to create a multi-step form, wizard, or guided assessment that runs in the browser without any framework dependencies.

## When to use
- User wants to build a step-by-step form or wizard
- User needs a lightweight browser form without React/Vue/Angular
- User mentions "wizard", "multi-step form", "guided assessment", or "onboarding flow"

## How to use

1. Import the framework:
   ```html
   <script src="shared.js"></script>
   ```

2. Create a wizard:
   ```javascript
   createWizard({
     stateKey: 'my-wizard',
     title: 'My Assessment',
     steps: [
       { id: 'step1', label: 'Basic Info', render: renderStep1 },
       { id: 'step2', label: 'Details', render: renderStep2 },
       { id: 'results', label: 'Results', render: renderResults }
     ]
   });
   ```

3. Each step's render function receives `(container, state, setState)`:
   ```javascript
   function renderStep1(container, state, setState) {
     const name = createTextInput({ label: 'Name', value: state.name || '' });
     name.input.addEventListener('change', () => setState({ name: name.input.value }));
     container.appendChild(name.wrapper);
   }
   ```

## Built-in components
- `createTextInput({ label, value, placeholder })` — Text input with label
- `createTextArea({ label, value, rows })` — Multi-line text input
- `createSelect({ label, options, value })` — Dropdown select
- `createToggle({ label, checked })` — Toggle switch
- `el(tag, attrs, children)` — DOM element helper

## Key behaviors
- Auto-persists state to sessionStorage (survives page reloads)
- Consistent design system (navy/amber/teal color scheme)
- Targeted DOM manipulation (no innerHTML for security)
- Zero external dependencies — pure vanilla JS
