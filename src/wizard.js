/**
 * wizard.js — Zero-dependency wizard/form framework for the browser.
 *
 * createWizard() renders a multi-step form with state persistence and theming.
 */

/**
 * Create a DOM element with attributes and children.
 *
 * @param {string} tag - HTML tag name
 * @param {object} [attrs] - Element attributes and event handlers
 * @param {(HTMLElement|string)[]} [children] - Child elements or text
 * @returns {HTMLElement}
 */
export function el(tag, attrs, children) {
  attrs = attrs || {};
  children = children || [];

  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'textContent') {
      element.textContent = value;
    } else if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else {
      element.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child) {
      element.appendChild(child);
    }
  }

  return element;
}

/**
 * Create a labeled section.
 *
 * @param {string} title - Section heading
 * @param {(HTMLElement|null)[]} contentArray - Content elements
 * @returns {HTMLElement}
 */
export function createSection(title, contentArray) {
  const section = el('div', { className: 'section' });
  section.appendChild(el('h2', {}, [title]));

  for (const item of contentArray) {
    if (item) section.appendChild(item);
  }

  return section;
}

/**
 * Create a yes/no toggle button pair.
 *
 * @param {string} label - Toggle label
 * @param {boolean|null} value - Current value (true/false)
 * @param {function} onChange - Callback on change
 * @returns {HTMLElement}
 */
export function createToggle(label, value, onChange) {
  const wrapper = el('div', { className: 'toggle-row' });

  wrapper.appendChild(el('label', { className: 'toggle-label' }, [label]));

  const group = el('div', { className: 'toggle-group' });

  const yesBtn = el('button', {
    className: 'toggle-btn' + (value === true ? ' active yes' : ''),
    textContent: 'Yes',
    onClick: function () {
      onChange(true);
      _updateToggle(wrapper, true);
    }
  });

  const noBtn = el('button', {
    className: 'toggle-btn' + (value === false ? ' active no' : ''),
    textContent: 'No',
    onClick: function () {
      onChange(false);
      _updateToggle(wrapper, false);
    }
  });

  group.appendChild(yesBtn);
  group.appendChild(noBtn);
  wrapper.appendChild(group);

  return wrapper;
}

function _updateToggle(wrapper, value) {
  const btns = wrapper.querySelectorAll('.toggle-btn');
  btns[0].className = 'toggle-btn' + (value === true ? ' active yes' : '');
  btns[1].className = 'toggle-btn' + (value === false ? ' active no' : '');
}

/**
 * Create a dropdown select field.
 *
 * @param {string} label - Field label
 * @param {object[]} options - Array of { value, label }
 * @param {string} [value] - Current selection value
 * @param {function} onChange - Callback on change
 * @returns {HTMLElement}
 */
export function createSelect(label, options, value, onChange) {
  const select = el('select', { className: 'field-select' });

  for (const opt of options) {
    const option = el('option', {
      value: opt.value,
      textContent: opt.label
    });
    if (opt.value === value) option.selected = true;
    select.appendChild(option);
  }

  select.addEventListener('change', function () {
    onChange(select.value);
  });

  const row = el('div', { className: 'field-row' });
  row.appendChild(el('label', { className: 'field-label' }, [label]));
  row.appendChild(select);

  return row;
}

/**
 * Create a text input field.
 *
 * @param {string} label - Field label
 * @param {string} [value] - Current value
 * @param {function} onChange - Callback on change
 * @param {string} [placeholder] - Placeholder text
 * @returns {HTMLElement}
 */
export function createTextInput(label, value, onChange, placeholder) {
  const input = el('input', {
    type: 'text',
    className: 'field-input',
    value: value || '',
    placeholder: placeholder || ''
  });

  input.addEventListener('input', function () {
    onChange(input.value);
  });

  const row = el('div', { className: 'field-row' });
  row.appendChild(el('label', { className: 'field-label' }, [label]));
  row.appendChild(input);

  return row;
}

/**
 * Create a textarea field.
 *
 * @param {string} label - Field label
 * @param {string} [value] - Current value
 * @param {function} onChange - Callback on change
 * @param {string} [placeholder] - Placeholder text
 * @returns {HTMLElement}
 */
export function createTextArea(label, value, onChange, placeholder) {
  const textarea = el('textarea', {
    className: 'field-textarea',
    placeholder: placeholder || ''
  });
  textarea.value = value || '';

  textarea.addEventListener('input', function () {
    onChange(textarea.value);
  });

  const row = el('div', { className: 'field-row' });
  row.appendChild(el('label', { className: 'field-label' }, [label]));
  row.appendChild(textarea);

  return row;
}

/**
 * Create an alert box.
 *
 * @param {string} type - Alert type: 'info', 'success', 'warning', 'danger'
 * @param {string} text - Alert message
 * @returns {HTMLElement}
 */
export function createAlert(type, text) {
  return el('div', {
    className: 'alert ' + type,
    textContent: text
  });
}

/**
 * Persist state to sessionStorage.
 *
 * @param {string} key - Storage key
 * @param {object} state - State object to persist
 */
export function persistState(key, state) {
  try {
    sessionStorage.setItem('wizard_' + key, JSON.stringify(state));
  } catch (e) {
    console.warn('[persistState] sessionStorage failed:', e.message);
  }
}

/**
 * Restore state from sessionStorage.
 *
 * @param {string} key - Storage key
 * @returns {object|null} Restored state or null
 */
export function restoreState(key) {
  try {
    const raw = sessionStorage.getItem('wizard_' + key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('[restoreState] sessionStorage failed:', e.message);
    return null;
  }
}

/**
 * Persist current step number to sessionStorage.
 *
 * @param {string} key - Storage key
 * @param {number} step - Step number
 */
export function persistStep(key, step) {
  try {
    sessionStorage.setItem('wizard_step_' + key, String(step));
  } catch (e) {
    console.warn('[persistStep] sessionStorage failed:', e.message);
  }
}

/**
 * Restore current step number from sessionStorage.
 *
 * @param {string} key - Storage key
 * @returns {number} Step number or 0
 */
export function restoreStep(key) {
  try {
    const raw = sessionStorage.getItem('wizard_step_' + key);
    return raw !== null ? parseInt(raw, 10) : 0;
  } catch (e) {
    console.warn('[restoreStep] sessionStorage failed:', e.message);
    return 0;
  }
}

/**
 * Inject CSS theme into the document.
 *
 * @param {string} [customCSS] - Custom CSS string. If omitted, uses default theme.
 */
export function injectCSS(customCSS) {
  const style = document.createElement('style');
  style.textContent = customCSS || '';
  document.head.appendChild(style);
}

/**
 * Trigger a file input dialog to load JSON config.
 *
 * @param {function} callback - Called with parsed config object
 */
export function loadConfigFromFile(callback) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const config = JSON.parse(ev.target.result);
        callback(config);
      } catch (err) {
        alert('Invalid JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

/**
 * Download config as JSON file.
 *
 * @param {object} config - Config object to save
 */
export function saveConfigToFile(config) {
  config.dates = config.dates || {};
  config.dates.configLastUpdated = new Date().toISOString().split('T')[0];

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wizard-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Download content as markdown file.
 *
 * @param {string} filename - File name
 * @param {string} content - Markdown content
 */
export function exportMarkdown(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Create a multi-step wizard/form framework.
 *
 * @param {object} opts - Wizard configuration
 * @param {string} opts.title - Page title
 * @param {string} [opts.subtitle] - Subtitle text
 * @param {number} opts.totalSteps - Total number of steps
 * @param {string[]} opts.stepLabels - Array of step labels/titles
 * @param {function} opts.renderStep - Callback: renderStep(stepNum, container) to render step content
 * @param {function} [opts.onSave] - Callback when "Save Config" clicked
 * @param {function} [opts.onLoad] - Callback when "Load Config" clicked
 * @param {function} [opts.onExport] - Callback when "Export Markdown" clicked
 * @param {string} [opts.stateKey] - Session storage key for auto-persist
 * @param {function} [opts.getState] - Callback to get current state object
 * @param {function} [opts.setState] - Callback to restore state object
 * @returns {object} Wizard controller { render(), refreshStep(), saveNow(), getCurrentStep(), setStep() }
 */
export function createWizard(opts) {
  let _currentStep = opts.stateKey ? restoreStep(opts.stateKey) : 0;
  if (_currentStep >= opts.totalSteps) _currentStep = 0;

  let _built = false;
  let _stepContainer = null;
  let _progressContainer = null;
  let _navContainer = null;

  function _buildChrome() {
    document.body.textContent = '';

    document.body.appendChild(el('h1', {}, [opts.title]));

    if (opts.subtitle) {
      document.body.appendChild(el('p', { className: 'subtitle' }, [opts.subtitle]));
    }

    const toolbar = el('div', { className: 'toolbar' });

    toolbar.appendChild(el('button', {
      className: 'btn',
      textContent: 'Load Config',
      onClick: function () {
        if (opts.onLoad) opts.onLoad();
      }
    }));

    toolbar.appendChild(el('button', {
      className: 'btn',
      textContent: 'Save Config',
      onClick: function () {
        if (opts.onSave) opts.onSave();
      }
    }));

    toolbar.appendChild(el('button', {
      className: 'btn primary',
      textContent: 'Export Markdown',
      onClick: function () {
        if (opts.onExport) opts.onExport();
      }
    }));

    document.body.appendChild(toolbar);

    _progressContainer = el('div', { className: 'progress' });
    document.body.appendChild(_progressContainer);

    _stepContainer = el('div', { id: 'step-container' });

    if (opts.stateKey && opts.getState) {
      let _saveTimer = null;
      _stepContainer.addEventListener('input', function () {
        clearTimeout(_saveTimer);
        _saveTimer = setTimeout(function () {
          persistState(opts.stateKey, opts.getState());
        }, 300);
      });
    }

    document.body.appendChild(_stepContainer);

    _navContainer = el('div', { className: 'step-nav' });
    document.body.appendChild(_navContainer);

    _built = true;
  }

  function _updateProgress() {
    _progressContainer.textContent = '';
    for (let i = 0; i < opts.totalSteps; i++) {
      let cls = 'progress-dot';
      if (i === _currentStep) cls += ' active';
      else if (i < _currentStep) cls += ' done';

      _progressContainer.appendChild(el('span', {
        className: cls,
        title: opts.stepLabels[i]
      }));
    }
  }

  function _updateNav() {
    _navContainer.textContent = '';

    if (_currentStep > 0) {
      _navContainer.appendChild(el('button', {
        className: 'btn',
        textContent: 'Previous',
        onClick: function () {
          _currentStep--;
          _refreshStep();
        }
      }));
    } else {
      _navContainer.appendChild(el('span'));
    }

    if (_currentStep < opts.totalSteps - 1) {
      _navContainer.appendChild(el('button', {
        className: 'btn primary',
        textContent: 'Next',
        onClick: function () {
          _currentStep++;
          _refreshStep();
        }
      }));
    }
  }

  function _refreshStep() {
    if (!_built) _buildChrome();

    const scrollY = window.scrollY;

    _stepContainer.textContent = '';
    _updateProgress();

    opts.renderStep(_currentStep, _stepContainer);

    _updateNav();

    if (opts.stateKey) {
      persistStep(opts.stateKey, _currentStep);
      if (opts.getState) {
        persistState(opts.stateKey, opts.getState());
      }
    }

    requestAnimationFrame(function () {
      window.scrollTo(0, scrollY);
    });
  }

  return {
    render: function () {
      if (opts.stateKey && opts.setState) {
        const saved = restoreState(opts.stateKey);
        if (saved) opts.setState(saved);
      }
      _buildChrome();
      _refreshStep();
    },

    refreshStep: function () {
      _refreshStep();
    },

    saveNow: function () {
      if (opts.stateKey && opts.getState) {
        persistState(opts.stateKey, opts.getState());
      }
    },

    getCurrentStep: function () {
      return _currentStep;
    },

    setStep: function (s) {
      _currentStep = s;
      _refreshStep();
    }
  };
}
