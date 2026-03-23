/**
 * themes/light.js — Light theme for zero-dep-wizard
 */

export const LIGHT_THEME = `
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: #FFFFFF;
  color: #333333;
  line-height: 1.6;
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

h1 {
  font-size: 1.8em;
  margin-bottom: 8px;
  color: #2C5F2D;
  font-weight: 300;
  letter-spacing: 1px;
}

h2 {
  font-size: 1.2em;
  margin: 24px 0 12px;
  color: #555555;
  font-weight: 400;
  border-bottom: 1px solid #DDDDDD;
  padding-bottom: 6px;
}

h3 {
  font-size: 1em;
  margin: 16px 0 8px;
  color: #777777;
}

.subtitle {
  color: #777777;
  font-size: 0.9em;
  margin-bottom: 24px;
}

.section {
  margin-bottom: 32px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 20px;
  border: 1px solid #CCCCCC;
  border-radius: 4px;
  background: #F5F5F5;
  color: #333333;
  cursor: pointer;
  font-size: 0.85em;
  transition: all 0.15s;
  font-family: inherit;
}

.btn:hover {
  background: #EEEEEE;
  border-color: #2C5F2D;
}

.btn.primary {
  background: #2C5F2D;
  border-color: #2C5F2D;
  color: #FFFFFF;
  font-weight: 600;
}

.btn.primary:hover {
  background: #1E4620;
}

.btn.success {
  background: #27A27A;
  border-color: #27A27A;
  color: white;
}

.btn.success:hover {
  background: #1D7D60;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  margin-bottom: 6px;
  background: #FAFAFA;
}

.toggle-label {
  flex: 1;
  font-size: 0.9em;
  padding-right: 16px;
}

.toggle-group {
  display: flex;
  gap: 4px;
}

.toggle-btn {
  padding: 4px 16px;
  border: 1px solid #CCCCCC;
  border-radius: 3px;
  background: transparent;
  color: #777777;
  cursor: pointer;
  font-size: 0.8em;
  transition: all 0.15s;
}

.toggle-btn.active.yes {
  background: #E74C3C;
  border-color: #E74C3C;
  color: white;
}

.toggle-btn.active.no {
  background: #27A27A;
  border-color: #27A27A;
  color: white;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.field-label {
  min-width: 200px;
  font-size: 0.85em;
  color: #555555;
}

.field-input,
.field-select,
.field-textarea {
  flex: 1;
  padding: 6px 10px;
  background: #FFFFFF;
  border: 1px solid #CCCCCC;
  border-radius: 3px;
  color: #333333;
  font-size: 0.85em;
  font-family: inherit;
}

.field-textarea {
  min-height: 60px;
  resize: vertical;
}

.field-input:focus,
.field-select:focus,
.field-textarea:focus {
  border-color: #2C5F2D;
  outline: none;
}

.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 0.7em;
  margin: 2px;
}

.badge.enacted {
  background: #D4C5A933;
  color: #8B7500;
  border: 1px solid #D4C5A955;
}

.badge.active-sector {
  background: #A7D8DE33;
  color: #0B6E7F;
  border: 1px solid #A7D8DE55;
}

.alert {
  padding: 12px 16px;
  border-radius: 4px;
  margin: 12px 0;
  font-size: 0.9em;
}

.alert.danger {
  background: #FADBD8;
  border: 1px solid #FADBD8;
  color: #C0392B;
}

.alert.success {
  background: #D5F4E6;
  border: 1px solid #D5F4E6;
  color: #27A27A;
}

.alert.warning {
  background: #FCF3E6;
  border: 1px solid #FCF3E6;
  color: #D67700;
}

.alert.info {
  background: #EBF5FB;
  border: 1px solid #EBF5FB;
  color: #1B4965;
}

.result-table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.result-table th,
.result-table td {
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #DDDDDD;
  font-size: 0.85em;
}

.result-table th {
  background: #F5F5F5;
  color: #555555;
}

.result-table td {
  background: #FFFFFF;
}

.step {
  display: none;
}

.step.active {
  display: block;
}

.step-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
}

.progress {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #CCCCCC;
}

.progress-dot.active {
  background: #D4943A;
}

.progress-dot.done {
  background: #27A27A;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
}

.checklist-item input[type="checkbox"] {
  accent-color: #2C5F2D;
}

.score-high {
  color: #E74C3C;
  font-weight: 600;
}

.score-med {
  color: #D67700;
  font-weight: 600;
}

.score-low {
  color: #27A27A;
  font-weight: 600;
}

.hidden {
  display: none;
}
`;
