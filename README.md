<div align="center">
  <h1>✨ Arjun Theme — ERPNext 15 Desk Theme</h1>
  <p><i>A modern glassmorphic theme for Frappe / ERPNext, forked and adapted for OM Logistics</i></p>
</div>

<hr />

## 📖 Overview

**Arjun Theme** modernizes the Frappe/ERPNext Desk experience — glassmorphism, a redesigned sidebar with animated `iconify` icons, micro-interactions, and a curated color palette.

This is a fork adapted for OM Logistics.

**Desk home**
<img src="screenshots/desk-home.png" alt="Desk home screenshot" width="900" />

**Form view**
<img src="screenshots/desk-form.png" alt="Form view screenshot" width="900" />

## 🚀 Features

- **Modern Layouts & Glassmorphism:** Clean, soft translucency combined with tuned drop shadows.
- **Dynamic Workspaces:** Fully responsive sidebar with customizable animated `iconify` icons.
- **Micro-Interactions:** Subtle hover states and polished widget cards.
- **Custom Color Palette:** Curated tones for a modern, cohesive Desk look.

## 🛠️ Installation

```bash
cd frappe-bench
bench get-app https://github.com/arjunolsc/arjun_theme.git
bench --site <sitename> install-app arjun_theme
bench build --app arjun_theme
```

## 🧑‍💻 Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/arjun_theme
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:
- `ruff`
- `eslint`
- `prettier`
- `pyupgrade`

## 📄 License

This software is released under the **MIT** License.
