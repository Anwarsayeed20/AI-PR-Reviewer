# 🤖 AI-PR Reviewer (PR Guardian AI)

> **AI-powered pull request reviews for GitHub** — catches bugs, security risks, and code smells before they hit production.

![PR Guardian AI](https://img.shields.io/badge/PR_Guardian-AI-00ff41?style=for-the-badge&logo=github&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

---

## ✨ Features

- **🔍 AI Code Review** — Uses LLMs to analyze diffs and provide intelligent feedback
- **🛡️ Security Scanner** — Detects hardcoded secrets, SQL injection, XSS vulnerabilities
- **📏 Static Rules Engine** — Catches TODOs, print statements, bare excepts
- **💬 Inline Comments** — Posts review comments directly on changed lines
- **🧠 5 LLM Providers** — HuggingFace, Groq, Gemini, Cerebras, OpenRouter
- **⚡ Zero Config** — Install the GitHub App, pick a provider, and you're live
- **🌐 Web Dashboard** — Configure installations, monitor providers, view API docs

---

## 🏗️ Architecture

```
GitHub PR Event
      │
      ▼
┌──────────────┐    ┌────────────┐    ┌──────────┐
│  GitHub       │───▶│  FastAPI    │───▶│  LLM     │
│  Webhook      │    │  Backend   │    │  Provider │
└──────────────┘    └─────┬──────┘    └──────────┘
                          │
                    ┌─────▼──────┐
                    │  MongoDB   │
                    │  Atlas     │
                    └────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- A GitHub App (for webhook integration)

### Local Development

```bash
# Clone the repo
git clone https://github.com/Abdur1R/AI-PR-Reviewer.git
cd AI-PR-Reviewer

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Install dependencies
pip install -r requirements.txt

# Run the backend (serves API + frontend)
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Then open **http://localhost:8000/app** to see the dashboard.

### Deploy to Render.com (Free)

1. Fork this repo
2. Sign up at [render.com](https://render.com)
3. Create a new **Web Service** → connect your GitHub repo
4. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables from `.env.example`
6. Deploy!

---

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_APP_ID` | ✅ | Your GitHub App ID |
| `GITHUB_PRIVATE_KEY_PATH` | ✅ | Path to GitHub App private key |
| `GITHUB_WEBHOOK_SECRET` | ✅ | Webhook secret |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `GROQ_API_KEY` | ⚡ | Groq API key |
| `GEMINI_API_KEY` | ⚡ | Google Gemini API key |
| `CEREBRAS_API_KEY` | ⚡ | Cerebras API key |
| `OPENROUTER_API_KEY` | ⚡ | OpenRouter API key |
| `HF_TOKEN` | ⚡ | HuggingFace token |

⚡ = At least one LLM provider key required

### Supported LLM Providers

| Provider | Model | Speed |
|---|---|---|
| 🤗 HuggingFace | Qwen2.5-Coder-7B | Medium |
| ⚡ Groq | Llama-3.3-70B | Fast |
| 💎 Gemini | Gemini-2.0-Flash | Fast |
| 🧠 Cerebras | Llama-3.1-8B | Very Fast |
| 🔀 OpenRouter | Auto-select | Varies |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `GET` | `/app` | Frontend dashboard |
| `POST` | `/webhook` | GitHub webhook receiver |
| `GET` | `/test-llm/{provider}` | Test single LLM |
| `GET` | `/test-llm` | Test all LLMs |
| `POST` | `/installations/{id}/settings` | Save config |
| `PUT` | `/installations/{id}/settings` | Update config |
| `GET` | `/installations/{id}` | Get installation |
| `GET` | `/users/{id}/installations` | List user installs |
| `GET` | `/api/repos/{id}` | List repos |

---

## 📁 Project Structure

```
AI-PR-Reviewer/
├── app/
│   ├── main.py          # FastAPI app + routes
│   ├── config.py         # Settings (env vars)
│   ├── db.py             # MongoDB connection
│   ├── models.py         # Pydantic models
│   ├── diff_parser.py    # Git diff parser
│   ├── rules.py          # Static analysis rules
│   ├── ai_reviewer.py    # AI review logic
│   ├── llm_client.py     # Local LLM client
│   └── llm/              # LLM provider implementations
│       ├── base.py       # Abstract provider
│       ├── factory.py    # Provider factory
│       ├── groq.py
│       ├── gemini.py
│       ├── cerebras.py
│       ├── huggingface.py
│       └── openrouter.py
├── frontend/
│   ├── index.html        # SPA dashboard
│   ├── styles.css        # Dark terminal theme
│   └── app.js            # Frontend logic
├── requirements.txt
├── Procfile              # Render.com deployment
├── render.yaml           # Render Blueprint
├── .env.example          # Environment template
└── README.md
```

---

## 🔒 Privacy & Security

- No user data is stored permanently
- Code diffs are processed in memory only
- Webhook signatures are cryptographically verified
- API keys are stored as environment variables, never in code
- See [PRIVACY.md](PRIVACY.md) and [TERMS.md](TERMS.md) for details

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/Abdur1R/AI-PR-Reviewer/issues)
- **Docs**: See [SUPPORT.md](SUPPORT.md)

---

Built with ❤️ by [Abdur1R](https://github.com/Abdur1R)