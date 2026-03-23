# Attribution

> Record of human and AI contributions to this project.

## Project

- **Name:** zero-dep-wizard
- **Repository:** https://github.com/justice8096/zero-dep-wizard
- **Started:** 2025 (embedded in LLMComplianceSkill)

---

## Contributors

### Human

| Name | Role | Areas |
|------|------|-------|
| Justice E. Chase | Lead developer | Architecture, design, domain logic, review, integration |

### AI Tools Used

| Tool | Model/Version | Purpose |
|------|---------------|---------|
| Claude | Claude Opus 4.6 | Code generation, documentation, testing, research |
| Claude Code | — | Agentic development, refactoring, extraction |

---

## Contribution Log

### Original Source Code
Extracted from LLMComplianceSkill/tools/interactive/shared.js and 21 wizards. Justice designed the createWizard() API, sessionStorage persistence, stateKey pattern, targeted DOM manipulation approach, and navy/amber/teal design system.

| Date | Tag | Description | AI Tool | Human Review |
|------|-----|-------------|---------|--------------|
| 2025-2026 | `human-only` | createWizard() API design, persistence pattern, DOM manipulation, design system (navy/amber/teal) | — | Justice E. Chase |

### Standalone Extraction

| Date | Tag | Description | AI Tool | Human Review |
|------|-----|-------------|---------|--------------|
| 2026-03-21 | `ai-assisted` | Extracted from LLMComplianceSkill and separated into reusable module | Claude Code | Architecture decisions, reviewed all code |
| 2026-03-21 | `ai-assisted` | Theming system, configuration abstraction | Claude Code | Reviewed and approved |
| 2026-03-21 | `ai-generated` | Package config, LICENSE | Claude Code | Reviewed and approved |
| 2026-03-21 | `ai-generated` | README documentation | Claude Code | Reviewed, edited |

### Improvements (2026-03-23)

| Date | Tag | Description | AI Tool | Human Review |
|------|-----|-------------|---------|--------------|
| 2026-03-23 | `ai-generated` | Additional example wizards (onboarding, configuration, survey) | Claude Code | Reviewed and approved |
| 2026-03-23 | `ai-generated` | Test suite (67 tests) with DOM interaction coverage | Claude Code | Reviewed and approved |
| 2026-03-23 | `ai-assisted` | Documentation and usage examples | Claude Code | Reviewed and edited |

---

## Commit Convention

Include `[ai:claude]` tag in commit messages for AI-assisted or AI-generated changes. Example:
```
Extract wizard library with theming [ai:claude]
```

---

## Disclosure Summary

| Category | Approximate % |
|----------|---------------|
| Human-only code | 30% |
| AI-assisted code | 25% |
| AI-generated (reviewed) | 45% |
| Documentation | 85% AI-assisted |
| Tests | 95% AI-generated |

---

## Notes

- All AI-generated or AI-assisted code is reviewed by a human contributor before merging.
- AI tools do not have repository access or commit privileges.
- This file is maintained manually and may not capture every interaction.
- Original source code was embedded in LLMComplianceSkill before extraction.
- Zero-dependency library: no npm dependencies required.

---

## License Considerations

AI-generated content may have different copyright implications depending on jurisdiction. See [LICENSE](./LICENSE) for this project's licensing terms. Contributors are responsible for ensuring AI-assisted work complies with applicable policies.
