# Contributing to FoundByMe

Thank you for your interest in contributing to **FoundByMe**!  
We welcome all contributions, whether it's fixing bugs, improving documentation, or adding new features.

---

## 🚀 How to Contribute

### 1. Fork the repository
Click the “Fork” button on the GitHub project page.

### 2. Create a feature branch
Use a clear, descriptive branch name:
```bash
git checkout -b feature/your-feature-name
```

### 3. Make your changes  
Write clear, readable code and follow the guidelines below.

### 4. Commit with a meaningful message
```bash
git commit -m "feat: add PDF text loader"
```

### 5. Push your branch
```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request (PR)
- Target branch must be **develop**
- Provide a short description of what you changed
- Link related issues (e.g., “Fixes #5”)

---

## 📝 Commit Message Guidelines

Use **Conventional Commits**:

| Prefix | Use for |
|--------|---------|
| `feat:` | new feature |
| `fix:` | bug fix |
| `docs:` | documentation changes |
| `refactor:` | code restructuring (no behavior change) |
| `test:` | testing-related changes |

**Examples**
- `docs: update README setup instructions`
- `feat: add Sentence-BERT embedding module`
- `fix: resolve vectorstore indexing bug`

---

## 🧩 Code Guidelines

- Follow **PEP8** naming conventions.
- Use **snake_case** for function names and variables.
- Add comments or docstrings for non-trivial logic.
- Keep functions small, modular, and single-purpose.
- Avoid committing large generated files (cache, embeddings, logs, etc.).

---

## 🐞 Reporting Issues

When opening an issue, please include:

- A clear description of the problem  
- Expected behavior  
- Steps to reproduce  
- Environment information:  
  - OS (Windows/macOS/Linux)  
  - Python version  
  - Installed libraries  

Use the GitHub “Issues” tab to submit.

---

## 🔀 Pull Request Requirements

Before submitting a PR:

- Code must run without errors.
- PRs should be **focused on a single change** (small and atomic).
- Include clear explanation of what was added, changed, or fixed.
- Link related issues if applicable.
- Ensure no unrelated files are included.

---

## ❤️ Thank You

Your contribution helps make FoundByMe better for everyone.  
We truly appreciate your time and effort!
