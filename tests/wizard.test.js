// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
  injectCSS,
  loadConfigFromFile,
  saveConfigToFile
} from '../src/wizard.js';

describe('el() - Element Creation', () => {
  it('creates element with tag', () => {
    const element = el('div');
    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.tagName).toBe('DIV');
  });

  it('sets className', () => {
    const element = el('div', { className: 'my-class container' });
    expect(element.className).toBe('my-class container');
  });

  it('sets textContent', () => {
    const element = el('div', { textContent: 'Hello World' });
    expect(element.textContent).toBe('Hello World');
  });

  it('sets multiple attributes', () => {
    const element = el('input', { 
      id: 'test-input', 
      type: 'text',
      placeholder: 'Enter text'
    });
    expect(element.id).toBe('test-input');
    expect(element.getAttribute('type')).toBe('text');
    expect(element.getAttribute('placeholder')).toBe('Enter text');
  });

  it('appends string children', () => {
    const parent = el('div', {}, ['Hello', ' ', 'World']);
    expect(parent.textContent).toBe('Hello World');
  });

  it('appends element children', () => {
    const child1 = el('span', { textContent: 'First' });
    const child2 = el('span', { textContent: 'Second' });
    const parent = el('div', {}, [child1, child2]);
    
    expect(parent.children.length).toBe(2);
    expect(parent.children[0]).toBe(child1);
    expect(parent.children[1]).toBe(child2);
  });

  it('handles null children gracefully', () => {
    const parent = el('div', {}, ['Text', null, el('span', { textContent: 'More' })]);
    expect(parent.textContent).toContain('Text');
    expect(parent.textContent).toContain('More');
  });

  it('attaches event handlers', () => {
    let clickCount = 0;
    const onClick = () => { clickCount++; };
    const element = el('button', { onClick });
    
    element.click();
    expect(clickCount).toBe(1);
    
    element.click();
    expect(clickCount).toBe(2);
  });

  it('supports multiple event handlers', () => {
    let mouseCount = 0;
    let clickCount = 0;
    
    const element = el('button', {
      onClick: () => { clickCount++; },
      onMouseenter: () => { mouseCount++; }
    });
    
    element.click();
    element.dispatchEvent(new MouseEvent('mouseenter'));
    
    expect(clickCount).toBe(1);
    expect(mouseCount).toBe(1);
  });
});

describe('createSection() - Section Helper', () => {
  it('creates div with h2 and content', () => {
    const content = el('p', { textContent: 'Content here' });
    const section = createSection('Section Title', [content]);
    
    expect(section).toBeInstanceOf(HTMLElement);
    expect(section.tagName).toBe('DIV');
    expect(section.className).toContain('section');
    expect(section.querySelector('h2')).toBeTruthy();
    expect(section.querySelector('h2').textContent).toBe('Section Title');
    expect(section.querySelector('p')).toBe(content);
  });

  it('handles array of content elements', () => {
    const content1 = el('p', { textContent: 'First' });
    const content2 = el('p', { textContent: 'Second' });
    const content3 = el('p', { textContent: 'Third' });
    const section = createSection('Title', [content1, content2, content3]);
    
    const paragraphs = section.querySelectorAll('p');
    expect(paragraphs.length).toBe(3);
  });

  it('filters out null/undefined content', () => {
    const content = el('p', { textContent: 'Valid' });
    const section = createSection('Title', [null, content, undefined]);
    
    expect(section.querySelectorAll('p').length).toBe(1);
  });
});

describe('createToggle() - Toggle Button Pair', () => {
  it('creates yes/no button pair', () => {
    const toggle = createToggle('Enable Feature', null, () => {});
    
    expect(toggle).toBeInstanceOf(HTMLElement);
    expect(toggle.className).toContain('toggle-row');
    
    const buttons = toggle.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent).toBe('Yes');
    expect(buttons[1].textContent).toBe('No');
  });

  it('displays label', () => {
    const toggle = createToggle('Accept Terms?', null, () => {});
    const label = toggle.querySelector('label');
    
    expect(label).toBeTruthy();
    expect(label.textContent).toBe('Accept Terms?');
  });

  it('marks active button on true value', () => {
    const toggle = createToggle('Test', true, () => {});
    const yesBtn = toggle.querySelectorAll('button')[0];
    
    expect(yesBtn.className).toContain('active');
    expect(yesBtn.className).toContain('yes');
  });

  it('marks active button on false value', () => {
    const toggle = createToggle('Test', false, () => {});
    const noBtn = toggle.querySelectorAll('button')[1];
    
    expect(noBtn.className).toContain('active');
    expect(noBtn.className).toContain('no');
  });

  it('calls onChange callback on button click', () => {
    let lastValue = null;
    const onChange = (value) => { lastValue = value; };
    const toggle = createToggle('Test', null, onChange);
    
    const buttons = toggle.querySelectorAll('button');
    buttons[0].click();
    expect(lastValue).toBe(true);
    
    buttons[1].click();
    expect(lastValue).toBe(false);
  });

  it('updates button states after click', () => {
    let state = null;
    const onChange = (value) => { state = value; };
    const toggle = createToggle('Test', null, onChange);
    
    const buttons = toggle.querySelectorAll('button');
    buttons[0].click(); // Click Yes
    
    let yesBtn = toggle.querySelectorAll('button')[0];
    expect(yesBtn.className).toContain('active');
  });
});

describe('createSelect() - Dropdown Helper', () => {
  it('creates select element with options', () => {
    const options = [
      { value: 'opt1', label: 'Option 1' },
      { value: 'opt2', label: 'Option 2' }
    ];
    const select = createSelect('Choose', options, null, () => {});
    
    expect(select).toBeInstanceOf(HTMLElement);
    const selectEl = select.querySelector('select');
    expect(selectEl).toBeTruthy();
    expect(selectEl.querySelectorAll('option').length).toBe(2);
  });

  it('displays label', () => {
    const select = createSelect('Pick One', [], null, () => {});
    const label = select.querySelector('label');
    
    expect(label).toBeTruthy();
    expect(label.textContent).toBe('Pick One');
  });

  it('selects initial value', () => {
    const options = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B' },
      { value: 'c', label: 'C' }
    ];
    const select = createSelect('Pick', options, 'b', () => {});
    const selectEl = select.querySelector('select');
    
    expect(selectEl.value).toBe('b');
  });

  it('calls onChange on value change', () => {
    let lastValue = null;
    const options = [
      { value: 'first', label: 'First' },
      { value: 'second', label: 'Second' }
    ];
    const onChange = (value) => { lastValue = value; };
    const select = createSelect('Pick', options, null, onChange);
    const selectEl = select.querySelector('select');
    
    selectEl.value = 'second';
    selectEl.dispatchEvent(new Event('change'));
    
    expect(lastValue).toBe('second');
  });
});

describe('createTextInput() - Text Input Helper', () => {
  it('creates input with label', () => {
    const input = createTextInput('Name', '', () => {});
    
    expect(input).toBeInstanceOf(HTMLElement);
    expect(input.querySelector('label')).toBeTruthy();
    expect(input.querySelector('label').textContent).toBe('Name');
    expect(input.querySelector('input')).toBeTruthy();
  });

  it('sets input type to text', () => {
    const input = createTextInput('Email', '', () => {});
    const inputEl = input.querySelector('input');
    
    expect(inputEl.type).toBe('text');
  });

  it('initializes with value', () => {
    const input = createTextInput('Name', 'John Doe', () => {});
    const inputEl = input.querySelector('input');
    
    expect(inputEl.value).toBe('John Doe');
  });

  it('sets placeholder text', () => {
    const input = createTextInput('Email', '', () => {}, 'john@example.com');
    const inputEl = input.querySelector('input');
    
    expect(inputEl.placeholder).toBe('john@example.com');
  });

  it('calls onChange on input', () => {
    let lastValue = null;
    const onChange = (value) => { lastValue = value; };
    const input = createTextInput('Name', '', onChange);
    const inputEl = input.querySelector('input');
    
    inputEl.value = 'Jane Doe';
    inputEl.dispatchEvent(new Event('input'));
    
    expect(lastValue).toBe('Jane Doe');
  });

  it('handles empty value', () => {
    const input = createTextInput('Optional', '', () => {});
    const inputEl = input.querySelector('input');
    
    expect(inputEl.value).toBe('');
  });
});

describe('createTextArea() - Textarea Helper', () => {
  it('creates textarea with label', () => {
    const textarea = createTextArea('Description', '', () => {});
    
    expect(textarea).toBeInstanceOf(HTMLElement);
    expect(textarea.querySelector('label')).toBeTruthy();
    expect(textarea.querySelector('label').textContent).toBe('Description');
    expect(textarea.querySelector('textarea')).toBeTruthy();
  });

  it('initializes with value', () => {
    const textarea = createTextArea('Notes', 'Some notes', () => {});
    const textareaEl = textarea.querySelector('textarea');
    
    expect(textareaEl.value).toBe('Some notes');
  });

  it('sets placeholder text', () => {
    const textarea = createTextArea('Comment', '', () => {}, 'Enter your comment...');
    const textareaEl = textarea.querySelector('textarea');
    
    expect(textareaEl.placeholder).toBe('Enter your comment...');
  });

  it('calls onChange on input', () => {
    let lastValue = null;
    const onChange = (value) => { lastValue = value; };
    const textarea = createTextArea('Comments', '', onChange);
    const textareaEl = textarea.querySelector('textarea');
    
    textareaEl.value = 'Multi-line\ntext here';
    textareaEl.dispatchEvent(new Event('input'));
    
    expect(lastValue).toBe('Multi-line\ntext here');
  });
});

describe('createAlert() - Alert Box Helper', () => {
  it('creates alert div', () => {
    const alert = createAlert('info', 'Information message');
    
    expect(alert).toBeInstanceOf(HTMLElement);
    expect(alert.tagName).toBe('DIV');
    expect(alert.className).toContain('alert');
  });

  it('sets alert type class', () => {
    const types = ['info', 'success', 'warning', 'danger'];
    
    types.forEach((type) => {
      const alert = createAlert(type, 'Message');
      expect(alert.className).toContain(type);
    });
  });

  it('displays message text', () => {
    const alert = createAlert('success', 'Operation completed');
    
    expect(alert.textContent).toBe('Operation completed');
  });
});

describe('persistState() / restoreState() - State Persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('round-trips state through sessionStorage', () => {
    const state = { name: 'John', email: 'john@example.com', age: 30 };
    
    persistState('testKey', state);
    const restored = restoreState('testKey');
    
    expect(restored).toEqual(state);
  });

  it('prefixes keys with "wizard_"', () => {
    const state = { value: 'test' };
    persistState('myKey', state);
    
    expect(sessionStorage.getItem('wizard_myKey')).toBeTruthy();
  });

  it('returns null for non-existent keys', () => {
    const result = restoreState('nonexistent');
    expect(result).toBeNull();
  });

  it('handles complex nested objects', () => {
    const state = {
      user: { id: 1, name: 'Alice', roles: ['admin', 'user'] },
      settings: { theme: 'dark', notifications: true, language: 'en' },
      data: [1, 2, 3, 4, 5]
    };
    
    persistState('complexKey', state);
    const restored = restoreState('complexKey');
    
    expect(restored.user.name).toBe('Alice');
    expect(restored.user.roles).toEqual(['admin', 'user']);
    expect(restored.settings.theme).toBe('dark');
    expect(restored.data).toEqual([1, 2, 3, 4, 5]);
  });

  it('overwrites existing state', () => {
    persistState('key', { value: 'first' });
    persistState('key', { value: 'second' });
    
    const restored = restoreState('key');
    expect(restored.value).toBe('second');
  });

  it('handles undefined values gracefully', () => {
    const state = { a: 1, b: undefined, c: null };
    persistState('key', state);
    const restored = restoreState('key');
    
    expect(restored.a).toBe(1);
    expect(restored.b).toBeUndefined();
    expect(restored.c).toBeNull();
  });
});

describe('persistStep() / restoreStep() - Step Navigation Persistence', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('persists and restores step number', () => {
    persistStep('wizardKey', 2);
    const step = restoreStep('wizardKey');
    
    expect(step).toBe(2);
  });

  it('returns 0 for first run (no prior save)', () => {
    const step = restoreStep('newWizard');
    expect(step).toBe(0);
  });

  it('handles step 0', () => {
    persistStep('key', 0);
    expect(restoreStep('key')).toBe(0);
  });

  it('updates step on multiple calls', () => {
    persistStep('key', 1);
    expect(restoreStep('key')).toBe(1);
    
    persistStep('key', 2);
    expect(restoreStep('key')).toBe(2);
    
    persistStep('key', 0);
    expect(restoreStep('key')).toBe(0);
  });

  it('prefixes keys with "wizard_step_"', () => {
    persistStep('myWizard', 1);
    expect(sessionStorage.getItem('wizard_step_myWizard')).toBe('1');
  });

  it('stores step as string and returns as number', () => {
    persistStep('key', 5);
    const stored = sessionStorage.getItem('wizard_step_key');
    const restored = restoreStep('key');
    
    expect(typeof stored).toBe('string');
    expect(typeof restored).toBe('number');
    expect(restored).toBe(5);
  });
});

describe('createWizard() - Wizard Framework', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    sessionStorage.clear();
  });

  it('creates wizard controller', () => {
    const wizard = createWizard({
      title: 'Test Wizard',
      totalSteps: 2,
      stepLabels: ['Step 1', 'Step 2'],
      renderStep: () => {}
    });
    
    expect(wizard).toBeDefined();
    expect(typeof wizard.render).toBe('function');
    expect(typeof wizard.refreshStep).toBe('function');
    expect(typeof wizard.getCurrentStep).toBe('function');
    expect(typeof wizard.setStep).toBe('function');
  });

  it('renders title and subtitle', () => {
    const wizard = createWizard({
      title: 'My Wizard',
      subtitle: 'Step through the process',
      totalSteps: 1,
      stepLabels: ['Complete'],
      renderStep: () => {}
    });
    
    wizard.render();
    
    expect(document.body.querySelector('h1')).toBeTruthy();
    expect(document.body.querySelector('h1').textContent).toBe('My Wizard');
    expect(document.body.textContent).toContain('Step through the process');
  });

  it('renders progress indicators', () => {
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 3,
      stepLabels: ['A', 'B', 'C'],
      renderStep: () => {}
    });
    
    wizard.render();
    
    const progressDots = document.body.querySelectorAll('.progress-dot');
    expect(progressDots.length).toBe(3);
  });

  it('marks current step as active', () => {
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 3,
      stepLabels: ['A', 'B', 'C'],
      renderStep: () => {}
    });
    
    wizard.render();
    
    const activeDot = document.body.querySelector('.progress-dot.active');
    expect(activeDot).toBeTruthy();
  });

  it('calls renderStep callback', () => {
    let renderCalled = false;
    let capturedStep = null;
    
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      renderStep: (stepNum, container) => {
        renderCalled = true;
        capturedStep = stepNum;
        container.appendChild(el('p', { textContent: 'Rendered' }));
      }
    });
    
    wizard.render();
    
    expect(renderCalled).toBe(true);
    expect(capturedStep).toBe(0);
    expect(document.body.querySelector('p').textContent).toBe('Rendered');
  });

  it('navigates to next step', () => {
    let renderedSteps = [];
    
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 2,
      stepLabels: ['First', 'Second'],
      renderStep: (stepNum) => {
        renderedSteps.push(stepNum);
      }
    });
    
    wizard.render();
    
    const nextBtn = document.body.querySelector('button:nth-child(2)');
    if (nextBtn && nextBtn.textContent === 'Next') {
      nextBtn.click();
    }
    
    expect(wizard.getCurrentStep()).toBe(1);
  });

  it('getCurrentStep returns current step', () => {
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 3,
      stepLabels: ['A', 'B', 'C'],
      renderStep: () => {}
    });
    
    expect(wizard.getCurrentStep()).toBe(0);
  });

  it('setStep jumps to specific step', () => {
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 3,
      stepLabels: ['A', 'B', 'C'],
      renderStep: () => {}
    });
    
    wizard.render();
    wizard.setStep(2);
    
    expect(wizard.getCurrentStep()).toBe(2);
  });

  it('refreshStep re-renders current step', () => {
    let renderCount = 0;
    
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      renderStep: () => {
        renderCount++;
      }
    });
    
    wizard.render();
    const initialCount = renderCount;
    
    wizard.refreshStep();
    
    expect(renderCount).toBeGreaterThan(initialCount);
  });

  it('persists state when stateKey and getState provided', () => {
    let state = { count: 0 };
    
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      stateKey: 'testWizard',
      getState: () => state,
      setState: (s) => { Object.assign(state, s); },
      renderStep: () => {}
    });
    
    wizard.render();
    state.count = 5;
    wizard.saveNow();
    
    const restored = restoreState('testWizard');
    expect(restored.count).toBe(5);
  });

  it('restores state on render if setState provided', () => {
    let state = { name: 'Alice' };
    
    // First wizard: set up state
    const wizard1 = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      stateKey: 'persistTest',
      getState: () => state,
      setState: () => {},
      renderStep: () => {}
    });
    
    wizard1.render();
    wizard1.saveNow();
    
    // Second wizard: restore state
    let restoredState = {};
    const wizard2 = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      stateKey: 'persistTest',
      getState: () => restoredState,
      setState: (s) => { Object.assign(restoredState, s); },
      renderStep: () => {}
    });
    
    wizard2.render();
    
    expect(restoredState.name).toBe('Alice');
  });

  it('shows toolbar buttons when callbacks provided', () => {
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      renderStep: () => {},
      onLoad: () => {},
      onSave: () => {},
      onExport: () => {}
    });
    
    wizard.render();
    
    expect(document.body.textContent).toContain('Load Config');
    expect(document.body.textContent).toContain('Save Config');
    expect(document.body.textContent).toContain('Export Markdown');
  });

  it('hides Previous button on first step', () => {
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 2,
      stepLabels: ['First', 'Second'],
      renderStep: () => {}
    });
    
    wizard.render();
    
    const buttons = document.body.querySelectorAll('button');
    const prevButton = Array.from(buttons).find(btn => btn.textContent === 'Previous');
    
    expect(prevButton).toBeFalsy();
  });

  it('hides Next button on last step', () => {
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 2,
      stepLabels: ['First', 'Second'],
      renderStep: () => {}
    });
    
    wizard.render();
    wizard.setStep(1);
    
    const buttons = document.body.querySelectorAll('button');
    const nextButton = Array.from(buttons).find(btn => btn.textContent === 'Next');
    
    expect(nextButton).toBeFalsy();
  });

  it('resets to step 0 if restored step exceeds totalSteps', () => {
    persistStep('overflowKey', 10);
    
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 3,
      stepLabels: ['A', 'B', 'C'],
      stateKey: 'overflowKey',
      renderStep: () => {}
    });
    
    expect(wizard.getCurrentStep()).toBe(0);
  });
});

describe('injectCSS() - Theme Injection', () => {
  beforeEach(() => {
    // Remove any injected styles
    document.querySelectorAll('style').forEach(s => s.remove());
  });

  it('injects style element into head', () => {
    const css = 'body { color: red; }';
    injectCSS(css);
    
    const styles = document.querySelectorAll('style');
    expect(styles.length).toBeGreaterThan(0);
    expect(styles[styles.length - 1].textContent).toBe(css);
  });

  it('injects empty CSS when none provided', () => {
    injectCSS();
    
    const styles = document.querySelectorAll('style');
    expect(styles.length).toBeGreaterThan(0);
  });

  it('allows multiple CSS injections', () => {
    injectCSS('body { color: blue; }');
    injectCSS('p { margin: 10px; }');
    
    const styles = document.querySelectorAll('style');
    expect(styles.length).toBeGreaterThanOrEqual(2);
  });
});

describe('State Management Pattern - Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    sessionStorage.clear();
  });

  it('follows getState/setState pattern', () => {
    let appState = { step1: { name: '' } };
    
    const wizard = createWizard({
      title: 'Form',
      totalSteps: 1,
      stepLabels: ['Info'],
      stateKey: 'formWizard',
      getState: () => appState,
      setState: (saved) => {
        Object.assign(appState, saved);
      },
      renderStep: (stepNum, container) => {
        container.appendChild(
          createTextInput(
            'Name:',
            appState.step1.name,
            (value) => { appState.step1.name = value; }
          )
        );
      }
    });
    
    wizard.render();
    
    // Simulate user input
    const input = document.body.querySelector('input');
    input.value = 'John';
    input.dispatchEvent(new Event('input'));
    
    expect(appState.step1.name).toBe('John');
  });

  it('preserves state across render cycles', () => {
    let formState = { data: 'initial' };
    
    const wizard = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      stateKey: 'multiRender',
      getState: () => formState,
      setState: (s) => { Object.assign(formState, s); },
      renderStep: () => {}
    });
    
    wizard.render();
    formState.data = 'modified';
    wizard.saveNow();
    
    // New wizard instance reads saved state
    let restoredState = {};
    const wizard2 = createWizard({
      title: 'Test',
      totalSteps: 1,
      stepLabels: ['Only'],
      stateKey: 'multiRender',
      getState: () => restoredState,
      setState: (s) => { Object.assign(restoredState, s); },
      renderStep: () => {}
    });
    
    wizard2.render();
    
    expect(restoredState.data).toBe('modified');
  });
});
