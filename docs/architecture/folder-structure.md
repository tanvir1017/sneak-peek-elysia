# Folder Structure

This document provides a detailed breakdown of the project's folder structure with explanations and naming conventions.

## Complete Directory Tree

```
.
├── src/                                  # Source code directory
│   ├── index.ts                          # Application entry point - starts server
│   ├── app.ts                            # Main Elysia app composition
│   │
│   ├── config/                           # Configuration layer
│   │   ├── env.ts                        # Environment variables with validation
│   │   ├── database.ts                   # Database connection & config
│   │   └── constants.ts                  # App-wide constants (status codes, etc.)
│   │
│   └── app/                              # Application layer (business logic)
│       │
│       ├── modules/                      # Feature modules (domain-driven)
│       │   │
│       │   ├── health/                   # Health check module
│       │   │   └── health.module.ts      # Health endpoints plugin
│       │   │
│       │   ├── auth/                     # Authentication module
│       │   │   ├── auth.module.ts        # Auth routes plugin export
│       │   │   ├── auth.controller.ts    # Auth HTTP handlers (login, register)
│       │   │   ├── auth.service.ts       # Auth business logic
│       │   │   ├── auth.repository.ts    # Auth data access layer
│       │   │   └── auth.types.ts         # Auth type definitions
│       │   │
│       │   └── users/                    # Users module
│       │       ├── users.module.ts       # Users routes plugin export
│       │       ├── users.controller.ts   # User HTTP handlers (CRUD)
│       │       ├── users.service.ts      # User business logic
│       │       ├── users.repository.ts   # User data access layer
│       │       └── users.types.ts        # User type definitions & DTOs
│       │
│       ├── plugins/                      # Global Elysia plugins
│       │   ├── error-handler.plugin.ts   # Centralized error handling
│       │   ├── response-transformer.plugin.ts  # Standardize API responses
│       │   ├── logger.plugin.ts          # Request/response logging with IDs
│       │   ├── rate-limiter.plugin.ts    # Rate limiting protection
│       │   ├── cors.plugin.ts            # CORS configuration
│       │   └── swagger.plugin.ts         # API documentation generator
│       │
│       ├── middleware/                   # Middleware functions
│       │   ├── auth.middleware.ts        # JWT authentication guard
│       │   └── validation.middleware.ts  # Request validation schemas
│       │
│       ├── utils/                        # Utility functions & helpers
│       │   ├── logger.ts                 # Logger utility wrapper
│       │   ├── jwt.ts                    # JWT token operations
│       │   ├── hash.ts                   # Password hashing utilities
│       │   └── response.ts               # Response formatting helpers
│       │
│       └── types/                        # Shared type definitions
│           ├── index.ts                  # Type re-exports
│           ├── common.types.ts           # Common interfaces & types
│           └── env.d.ts                  # Environment type declarations
│
├── docs/                                 # Project documentation
│   ├── README.md                         # Documentation index
│   │
│   ├── api/                              # API documentation
│   │   ├── endpoints.md                  # API endpoint reference
│   │   └── authentication.md             # Auth flow & JWT docs
│   │
│   ├── architecture/                     # Architecture documentation
│   │   ├── overview.md                   # Architecture deep dive
│   │   ├── folder-structure.md           # This file - folder explanations
│   │   └── design-patterns.md            # Design patterns used
│   │
│   └── guides/                           # How-to guides
│       ├── getting-started.md            # Quick start guide
│       ├── adding-new-module.md          # Step-by-step module creation
│       ├── testing.md                    # Testing strategies & examples
│       ├── deployment.md                 # Deployment instructions
│       └── contributing.md               # Contribution guidelines
│
├── test/                                 # Test suites
│   ├── setup.ts                          # Test configuration & setup
│   │
│   ├── unit/                             # Unit tests (isolated functions)
│   │   ├── users.service.test.ts         # User service unit tests
│   │   └── auth.service.test.ts          # Auth service unit tests
│   │
│   ├── integration/                      # Integration tests (with DB)
│   │   ├── users.test.ts                 # User endpoints integration tests
│   │   └── auth.test.ts                  # Auth endpoints integration tests
│   │
│   └── e2e/                              # End-to-end tests (full flows)
│       ├── health.test.ts                # Health check E2E tests
│       └── user-flow.test.ts             # Complete user flow tests
│
├── .github/                              # GitHub-specific files
│   ├── workflows/                        # GitHub Actions workflows
│   │   ├── ci.yml                        # Continuous Integration pipeline
│   │   └── cd.yml                        # Continuous Deployment pipeline
│   │
│   ├── ISSUE_TEMPLATE/                   # Issue templates
│   │   ├── bug_report.md                 # Bug report template
│   │   └── feature_request.md            # Feature request template
│   │
│   └── pull_request_template.md          # PR template with checklist
│
├── .husky/                               # Git hooks (via Husky)
│   ├── pre-commit                        # Run before commit (lint, format)
│   ├── commit-msg                        # Validate commit message format
│   └── pre-push                          # Run before push (tests)
│
├── docker/                               # Docker configurations
│   ├── Dockerfile.dev                    # Development Docker image
│   └── Dockerfile.prod                   # Production Docker image
│
├── Dockerfile                            # Main Dockerfile (production)
├── docker-compose.yml                    # Multi-container setup (app, DB, Redis)
├── .dockerignore                         # Files to exclude from Docker build
│
├── .env.example                          # Environment variables template
├── .gitignore                            # Git ignore patterns
│
├── tsconfig.json                         # TypeScript compiler configuration
├── package.json                          # Project dependencies & scripts
├── bunfig.toml                          # Bun runtime configuration
│
├── README.md                             # Project overview & setup
├── CONTRIBUTING.md                       # Contribution guidelines
└── CHANGELOG.md                          # Version history & changes
```

---

## Naming Conventions

### File Naming

#### TypeScript Files

- **Pattern**: `kebab-case.type.ts`
- **Examples**:
  - `users.service.ts` - Service file
  - `auth.controller.ts` - Controller file
  - `error-handler.plugin.ts` - Plugin file
  - `common.types.ts` - Type definitions

#### Test Files

- **Pattern**: `file-name.test.ts`
- **Location**: Mirror source structure in `test/` folder
- **Examples**:
  - `users.service.test.ts` - Tests for users.service.ts
  - `auth.test.ts` - Integration tests for auth module

#### Configuration Files

- **Pattern**: `lowercase.config.ext`
- **Examples**:
  - `tsconfig.json`
  - `bunfig.toml`
  - `docker-compose.yml`

#### Documentation Files

- **Pattern**: `kebab-case.md`
- **Examples**:
  - `getting-started.md`
  - `folder-structure.md`
  - `api-reference.md`

### Folder Naming

- **Pattern**: `lowercase` without dashes for simple names
- **Examples**:
  - `modules/` not `Modules/`
  - `plugins/` not `Plugins/`
  - `utils/` not `Utils/`
  - `user-management/` for multi-word module names

### Module File Suffixes

Each module follows this consistent pattern:

```
module-name/
├── module-name.module.ts      # Plugin export (routes composition)
├── module-name.controller.ts  # HTTP route handlers
├── module-name.service.ts     # Business logic layer
├── module-name.repository.ts  # Data access layer
└── module-name.types.ts       # Type definitions & DTOs
```

**Suffix Meanings**:

- `.module.ts` - Elysia plugin that exports routes
- `.controller.ts` - HTTP request/response handlers
- `.service.ts` - Business logic and orchestration
- `.repository.ts` - Database queries and data access
- `.types.ts` - TypeScript interfaces, types, DTOs
- `.plugin.ts` - Reusable Elysia plugins
- `.middleware.ts` - Middleware functions
- `.test.ts` - Test files

---

## Directory Purpose Breakdown

### Root Level

| Directory/File  | Purpose                              | Notes                         |
| --------------- | ------------------------------------ | ----------------------------- |
| `src/`          | All application source code          | Only directory deployed       |
| `docs/`         | Project documentation                | Markdown files for developers |
| `test/`         | Test suites (unit, integration, e2e) | Separate from source          |
| `.github/`      | GitHub workflows & templates         | CI/CD automation              |
| `.husky/`       | Git hooks for quality checks         | Pre-commit, pre-push hooks    |
| `docker/`       | Docker configuration variants        | Dev & prod Dockerfiles        |
| `package.json`  | Dependencies & npm scripts           | Bun compatible                |
| `tsconfig.json` | TypeScript configuration             | Strict mode enabled           |
| `bunfig.toml`   | Bun-specific settings                | Test config, hot reload       |

### Source Directory (`src/`)

#### Top Level Files

| File       | Purpose                     | When It Runs         |
| ---------- | --------------------------- | -------------------- |
| `index.ts` | Application entry point     | Start command        |
| `app.ts`   | Elysia instance composition | Imported by index.ts |

**Why separate?**

- `index.ts` handles server lifecycle (start, stop)
- `app.ts` composes the app (testable without server)

#### Config Directory (`src/config/`)

Configuration that changes between environments.

| File           | Contains              | Examples                       |
| -------------- | --------------------- | ------------------------------ |
| `env.ts`       | Environment variables | PORT, JWT_SECRET, DATABASE_URL |
| `database.ts`  | DB connection config  | Connection pool, retry logic   |
| `constants.ts` | Application constants | HTTP status codes, error codes |

**Key principle**: Config is **read-only** after startup.

#### App Directory (`src/app/`)

The heart of your application - all business logic lives here.

##### Modules (`src/app/modules/`)

**One module = One feature/domain**

Each module is completely **self-contained**:

- Has its own routes (`.module.ts`)
- Handles its own HTTP logic (`.controller.ts`)
- Contains business rules (`.service.ts`)
- Manages its data (`.repository.ts`)
- Defines its types (`.types.ts`)

**Benefits**:

- Easy to extract into microservice
- Can be developed independently
- Clear ownership boundaries
- Simple to test in isolation

##### Plugins (`src/app/plugins/`)

**Global behavior** applied across all routes.

| Plugin                 | Applied When              | Purpose                      |
| ---------------------- | ------------------------- | ---------------------------- |
| `error-handler`        | After error thrown        | Format & log errors          |
| `response-transformer` | After successful response | Standardize response format  |
| `logger`               | Before & after request    | Log requests with IDs        |
| `rate-limiter`         | Before route handler      | Prevent abuse                |
| `cors`                 | Before route handler      | Enable cross-origin requests |
| `swagger`              | On app start              | Generate API docs            |

**Plugin vs Middleware**:

- Plugins: Global, framework-level concerns
- Middleware: Route-specific logic

##### Middleware (`src/app/middleware/`)

**Selective route protection**.

| Middleware   | Use Case                     | Example                                    |
| ------------ | ---------------------------- | ------------------------------------------ |
| `auth`       | Protect authenticated routes | `app.use(authMiddleware).get('/profile')`  |
| `validation` | Validate request data        | `app.post('/users', validateBody(schema))` |

**When to create middleware**:

- Need to run before specific routes
- Can be applied selectively
- Route-level concern (not global)

##### Utils (`src/app/utils/`)

**Reusable helper functions** without business logic.

| Util       | Purpose          | Used By                 |
| ---------- | ---------------- | ----------------------- |
| `logger`   | Logging wrapper  | All layers              |
| `jwt`      | Token operations | Auth module, middleware |
| `hash`     | Password hashing | Auth service            |
| `response` | Format responses | Controllers, plugins    |

**Characteristics**:

- Pure functions (no side effects)
- No dependencies on other modules
- Fully testable
- Domain-agnostic

##### Types (`src/app/types/`)

**Shared TypeScript definitions**.

| File              | Contains           | Examples                        |
| ----------------- | ------------------ | ------------------------------- |
| `common.types.ts` | Shared interfaces  | `PaginatedResponse`, `ApiError` |
| `env.d.ts`        | Type augmentations | Extend `Elysia` context         |
| `index.ts`        | Re-exports         | Single import point             |

**When to put types here**:

- Used by 2+ modules
- Framework extensions
- Global type utilities

**When NOT to**:

- Module-specific types (put in module's `.types.ts`)
- Third-party types (use from packages)

---

## Documentation Directory (`docs/`)

### Structure Purpose

| Directory       | Contains                | Audience                     |
| --------------- | ----------------------- | ---------------------------- |
| `api/`          | API reference docs      | Frontend devs, API consumers |
| `architecture/` | Design & structure docs | Backend devs, architects     |
| `guides/`       | How-to tutorials        | New developers, contributors |

### Documentation Files

| File                   | Purpose               | Updates                    |
| ---------------------- | --------------------- | -------------------------- |
| `README.md`            | Docs entry point      | On major structure changes |
| `getting-started.md`   | Setup instructions    | When setup process changes |
| `adding-new-module.md` | Module creation guide | When patterns change       |
| `folder-structure.md`  | This file             | When structure changes     |
| `design-patterns.md`   | Pattern explanations  | When new patterns added    |

---

## Test Directory (`test/`)

### Test Organization

```
test/
├── setup.ts              # Test environment configuration
├── unit/                 # Fast, isolated tests
├── integration/          # Tests with real dependencies
└── e2e/                  # Full application tests
```

### Test File Naming

**Pattern**: `{source-file}.test.ts` or `{feature}.test.ts`

**Examples**:

- `users.service.test.ts` - Unit tests for `users.service.ts`
- `auth.test.ts` - Integration tests for auth endpoints
- `user-flow.test.ts` - E2E test for complete user journey

### Test Types

| Type            | Tests                    | Dependencies   | Speed  | Coverage       |
| --------------- | ------------------------ | -------------- | ------ | -------------- |
| **Unit**        | Single functions/classes | Mocked         | Fast   | High           |
| **Integration** | Multiple components      | Real DB (test) | Medium | Medium         |
| **E2E**         | Full user flows          | Full stack     | Slow   | Critical paths |

---

## CI/CD Directory (`.github/`)

### Workflows

| File     | Trigger          | Purpose                         |
| -------- | ---------------- | ------------------------------- |
| `ci.yml` | On PR & push     | Run tests, linting, type checks |
| `cd.yml` | On merge to main | Deploy to production            |

### Templates

| File                       | Purpose                   |
| -------------------------- | ------------------------- |
| `bug_report.md`            | Structured bug reports    |
| `feature_request.md`       | Feature proposal template |
| `pull_request_template.md` | PR checklist              |

---

## Git Hooks (`.husky/`)

### Hook Files

| Hook         | Runs              | Checks                      |
| ------------ | ----------------- | --------------------------- |
| `pre-commit` | Before commit     | Lint, format, type check    |
| `commit-msg` | On commit message | Conventional commits format |
| `pre-push`   | Before push       | Run tests                   |

**Benefits**:

- Catch issues early
- Enforce code standards
- Prevent bad commits
- Team consistency

---

## Docker Directory

### Files

| File                     | Purpose               | Use Case                  |
| ------------------------ | --------------------- | ------------------------- |
| `Dockerfile`             | Production image      | Deployed to production    |
| `docker/Dockerfile.dev`  | Development image     | Hot reload, debugging     |
| `docker/Dockerfile.prod` | Optimized prod image  | Multi-stage, minimal size |
| `docker-compose.yml`     | Multi-container setup | Local dev with DB & Redis |
| `.dockerignore`          | Exclude from build    | Speed up builds           |

---

## Key Principles

### 1. Separation of Concerns

Each directory has a **single, clear purpose**. No mixing of concerns.

### 2. Modularity

Modules are **self-contained** and can be extracted easily.

### 3. Discoverability

Developers can **find files quickly** by following naming conventions.

### 4. Scalability

Structure supports **growth** - easy to add modules without reorganizing.

### 5. Consistency

**Same patterns** everywhere - reduces cognitive load.

### 6. Testability

Test structure **mirrors** source structure - easy to find tests.

---

## Adding New Files

### Adding a New Module

1. Create folder: `src/app/modules/new-feature/`
2. Add files:
   - `new-feature.module.ts`
   - `new-feature.controller.ts`
   - `new-feature.service.ts`
   - `new-feature.repository.ts`
   - `new-feature.types.ts`
3. Register in `src/app.ts`
4. Add tests in `test/unit/` and `test/integration/`

### Adding a New Utility

1. Create file: `src/app/utils/utility-name.ts`
2. Export functions
3. Add unit tests: `test/unit/utility-name.test.ts`
4. Document in code comments

### Adding Documentation

1. Determine category: `api/`, `architecture/`, or `guides/`
2. Create file: `docs/{category}/topic-name.md`
3. Add link to `docs/README.md`
4. Use clear headings and examples

---

## Anti-Patterns to Avoid

❌ **Don't**: Mix different concerns in same file
✅ **Do**: Separate controller, service, repository

❌ **Don't**: Create deep nesting (> 3 levels)
✅ **Do**: Keep structure flat and discoverable

❌ **Don't**: Use inconsistent naming
✅ **Do**: Follow established naming conventions

❌ **Don't**: Put business logic in controllers
✅ **Do**: Keep controllers thin, logic in services

❌ **Don't**: Share mutable state between modules
✅ **Do**: Use dependency injection or events

❌ **Don't**: Create circular dependencies
✅ **Do**: Use dependency inversion principle

---

## Further Reading

- [Architecture Overview](./overview.md) - Deep dive into architecture
- [Design Patterns](./design-patterns.md) - Patterns used in this project
- [Adding a New Module](../guides/adding-new-module.md) - Step-by-step guide
