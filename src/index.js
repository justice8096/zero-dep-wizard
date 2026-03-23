/**
 * index.js — Main entry point for zero-dep-wizard
 */

export {
  el,
  createSection,
  createToggle,
  createSelect,
  createTextInput,
  createTextArea,
  createAlert,
  persistState,
  restoreState,
  persistStep,
  restoreStep,
  injectCSS,
  loadConfigFromFile,
  saveConfigToFile,
  exportMarkdown,
  createWizard
} from './wizard.js';

export { DEFAULT_THEME } from './themes/default.js';
export { LIGHT_THEME } from './themes/light.js';
