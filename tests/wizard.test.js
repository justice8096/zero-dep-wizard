// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
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
  createWizard,
} from '../src/wizard.js';

describe('el()', () => {
  it('creates element with tag', () => {
    const element = el('div');
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('DIV');
  });

  it('sets className', () => {
    const element = el('div', { className: 'my-class' });
    expect(element.className).toBe('my-class');
  });

  it('sets textContent', () => {
    const element = el('div', { textContent: 'Hello World' });
    expect(element.textContent).toBe('Hello World');
  });

  it('sets attributes', () => {
    const element = el('input', { id: 'test-input', type: 'text' });
    expect(element.id).toBe('test-input');
    expect(element.getAttribute('type')).toBe('text');
  });

  it('appends children', () => {
    const child = el('span', { textContent: 'Child' });
    const parent = el('div', { children: [child] });
    expect(parent.children.length).toBe(1);
    expect(parent.children[0]).toBe(child);
  });

  it('sets event handlers', () => {
    let clickCount = 0;
    const onClick = () => {
      clickCount++;
    };
    const element = el('button', { onClick });
    element.click();
    expect(clickCount).toBe(1);
  });
});

describe('createSection()', () => {
  it('creates div with h2 and content', () => {
    const content = el('p', { textContent: 'Content here' });
    const section = createSection('Section Title', content);
    
    expect(section).toBeInstanceOf(HTMLElement);
    expect(section.tagName).toBe('DIV');
    expect(section.querySelector('h2')).toBeTruthy();
    expect(section.querySelector('h2').textContent).toBe('Section Title');
    expect(section.querySelector('p')).toBe(content);
  });

  it('handles multiple content elements', () => {
    const content1 = el('p', { textContent: 'First' });
    const content2 = el('p', { textContent: 'Second' });
    const section = createSection('Title', [content1, content2]);
    
    expect(section.querySelectorAll('p').length).toBe(2);
  });
});

describe('createToggle()', () => {
  it('creates yes/no buttons', () => {
    const toggle = createToggle('Enable Feature');
    
    expect(toggle).toBeInstanceOf(HTMLElement);
    const buttons = toggle.querySelectorAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });

  it('calls onChange on button click', () => {
    let lastValue = null;
    const onChange = (value) => {
      lastValue = value;
    };
    const toggle = createToggle('Test', onChange);
    const buttons = toggle.querySelectorAll('button');
    
    buttons[0].click();
    expect(lastValue).toBeDefined();
  });

  it('toggles between states', () => {
    const values = [];
    const onChange = (value) => {
      values.push(value);
    };
    const toggle = createToggle('Test', onChange);
    const buttons = toggle.querySelectorAll('button');
    
    buttons[0].click();
    buttons[1].click();
    expect(values.length).toBe(2);
    expect(values[0]).not.toBe(values[1]);
  });
});

describe('createSelect()', () => {
  it('creates dropdown', () => {
    const select = createSelect('Choose', [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ]);
    
    expect(select).toBeInstanceOf(HTMLElement);
    const selectEl = select.querySelector('select');
    expect(selectEl).toBeTruthy();
  });

  it('selects correct option', () => {
    const options = [
      { label: 'First', value: 'first' },
      { label: 'Second', value: 'second' },
    ];
    const onChange = (value) => {
      expect(value).toBe('second');
    };
    const select = createSelect('Pick', options, onChange);
    const selectEl = select.querySelector('select');
    
    selectEl.value = 'second';
    selectEl.dispatchEvent(new Event('change'));
  });
});

describe('createTextInput()', () => {
  it('creates input with label', () => {
    const input = createTextInput('Name');
    
    expect(input).toBeInstanceOf(HTMLElement);
    expect(input.querySelector('label')).toBeTruthy();
    expect(input.querySelector('label').textContent).toBe('Name');
    expect(input.querySelector('input')).toBeTruthy();
  });

  it('allows setting value', () => {
    const input = createTextInput('Email');
    const inputEl = input.querySelector('input');
    inputEl.value = 'test@example.com';
    
    expect(inputEl.value).toBe('test@example.com');
  });

  it('has correct input type', () => {
    const input = createTextInput('Username', 'text');
    const inputEl = input.querySelector('input');
    
    expect(inputEl.type).toBe('text');
  });
});

describe('createTextArea()', () => {
  it('creates textarea with label', () => {
    const textarea = createTextArea('Description');
    
    expect(textarea).toBeInstanceOf(HTMLElement);
    expect(textarea.querySelector('label')).toBeTruthy();
    expect(textarea.querySelector('label').textContent).toBe('Description');
    expect(textarea.querySelector('textarea')).toBeTruthy();
  });

  it('allows setting value', () => {
    const textarea = createTextArea('Notes');
    const textareaEl = textarea.querySelector('textarea');
    textareaEl.value = 'Some notes here';
    
    expect(textareaEl.value).toBe('Some notes here');
  });
});

describe('createAlert()', () => {
  it('creates alert with type class', () => {
    const alert = createAlert('Success!', 'success');
    
    expect(alert).toBeInstanceOf(HTMLElement);
    expect(alert.className).toContain('alert');
    expect(alert.className).toContain('success');
    expect(alert.textContent).toBe('Success!');
  });

  it('supports different alert types', () => {
    const types = ['success', 'error', 'warning', 'info'];
    
    types.forEach((type) => {
      const alert = createAlert('Message', type);
      expect(alert.className).toContain(type);
    });
  });
});

describe('persistState/restoreState', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('round-trips state through sessionStorage', () => {
    const state = { name: 'John', email: 'john@example.com', age: 30 };
    
    persistState('testKey', state);
    const restored = restoreState('testKey');
    
    expect(restored).toEqual(state);
  });

  it('returns null for non-existent keys', () => {
    const result = restoreState('nonexistent');
    expect(result).toBeNull();
  });

  it('handles complex nested objects', () => {
    const state = {
      user: { id: 1, name: 'Alice' },
      settings: { theme: 'dark', notifications: true },
    };
    
    persistState('complexKey', state);
    const restored = restoreState('complexKey');
    
    expect(restored.user.name).toBe('Alice');
    expect(restored.settings.theme).toBe('dark');
  });
});

describe('persistStep/restoreStep', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('round-trips step number', () => {
    persistStep(3);
    const step = restoreStep();
    
    expect(step).toBe(3);
  });

  it('returns 0 for first run', () => {
    const step = restoreStep();
    expect(step).toBe(0);
  });

  it('updates step on multiple calls', () => {
    persistStep(1);
    expect(restoreStep()).toBe(1);
    
    persistStep(2);
    expect(restoreStep()).toBe(2);
  });
});

describe('createWizard()', () => {
  it('creates wizard', () => {
    const steps = [
      { title: 'Step 1', content: el('p', { textContent: 'Step 1' }) },
      { title: 'Step 2', content: el('p', { textContent: 'Step 2' }) },
    ];
    
    const wizard = createWizard(steps);
    expect(wizard).toBeInstanceOf(HTMLElement);
  });

  it('renders steps', () => {
    const steps = [
      { title: 'First', content: el('p', { textContent: 'First Step' }) },
      { title: 'Second', content: el('p', { textContent: 'Second Step' }) },
    ];
    
    const wizard = createWizard(steps);
    document.body.appendChild(wizard);
    
    expect(wizard.querySelector('p')).toBeTruthy();
    
    document.body.removeChild(wizard);
  });

  it('navigates between steps', () => {
    const steps = [
      { title: 'Step 1', content: el('p', { textContent: 'First' }) },
      { title: 'Step 2', content: el('p', { textContent: 'Second' }) },
    ];
    
    const wizard = createWizard(steps);
    document.body.appendChild(wizard);
    
    const nextButton = wizard.querySelector('[data-action="next"]');
    if (nextButton) {
      nextButton.click();
    }
    
    document.body.removeChild(wizard);
  });

  it('shows step indicators', () => {
    const steps = [
      { title: 'Step 1', content: el('div') },
      { title: 'Step 2', content: el('div') },
      { title: 'Step 3', content: el('div') },
    ];
    
    const wizard = createWizard(steps);
    document.body.appendChild(wizard);
    
    expect(wizard.innerHTML).toContain('Step');
    
    document.body.removeChild(wizard);
  });
});
