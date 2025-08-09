# Backend File Structure

```
backend/
├── 📁 app/                          # Main application package
│   ├── 📁 api/                      # FastAPI route modules
│   │   ├── 🔧 detection.py          # /start, /stop, /status contracts
│   │   ├── 🔧 twilio_webhook.py     # TwiML return + enable/disable logic
│   │   └── 🔧 ws_media.py           # WebSocket media ingest contracts
│   │
│   ├── 📁 services/                 # Business logic services
│   │   ├── 🔧 twilio_service.py     # Twilio REST orchestration boundaries
│   │   ├── 🔧 resemble_service.py   # Detect session mgmt, streaming contract
│   │   ├── 🔧 audio_pipeline.py     # decode/resample interface
│   │   └── 🔧 notifier.py           # push updates to clients (WS/SSE)
│   │
│   ├── 📁 core/                     # Core application modules
│   │   ├── 🔧 config.py             # env var names & precedence
│   │   ├── 🔧 security.py           # Twilio signature validation, tokens
│   │   └── 🔧 logging.py            # log fields, correlation IDs
│   │
│   ├── 📁 db/                       # Database layer
│   │   ├── 📁 models/               # SQL schema (tables)
│   │   │   └── 🔧 __init__.py       # models package
│   │   └── 📁 migrations/           # migration plan only
│   │       └── 🔧 __init__.py       # migrations package
│   │
│   └── 🔧 main.py                   # app wiring (FastAPI app)
│
├── 📁 tests/                        # Test suite
│   └── 🔧 __init__.py               # test package
│
├── 📁 venv/                         # Virtual environment (gitignored)
├── 🔧 requirements.txt              # Python dependencies
├── 🔧 setup.sh                      # Virtual environment setup script
├── 🔧 Dockerfile                    # containerization plan
└── 📄 README.md                     # setup + runbook
```

## Key Components

### 🎯 **API Layer** (`app/api/`)

- **detection.py**: Core detection endpoints for starting/stopping sessions
- **twilio_webhook.py**: Handles Twilio webhooks and TwiML responses
- **ws_media.py**: WebSocket endpoints for real-time media streaming

### 🔧 **Services Layer** (`app/services/`)

- **twilio_service.py**: Twilio API integration and call management
- **resemble_service.py**: AI detection and streaming services
- **audio_pipeline.py**: Audio processing and format conversion
- **notifier.py**: Real-time notifications to clients

### 🛡️ **Core Layer** (`app/core/`)

- **config.py**: Environment configuration and settings
- **security.py**: Authentication, authorization, and Twilio validation
- **logging.py**: Structured logging and correlation IDs

### 🗄️ **Database Layer** (`app/db/`)

- **models/**: SQLAlchemy models and database schemas
- **migrations/**: Database migration scripts and versioning

### 🧪 **Testing** (`tests/`)

- Unit tests, integration tests, and test utilities

## Development Workflow

1. **Setup**: Run `./setup.sh` to create virtual environment
2. **Install**: `pip install -r requirements.txt`
3. **Develop**: Work on feature branches (e.g., `feature/twilio-streaming`)
4. **Test**: Run tests with `pytest`
5. **Deploy**: Use Dockerfile for containerization
