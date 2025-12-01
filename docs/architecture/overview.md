# Architecture Overview

## Table of Contents

- [Introduction](#introduction)
- [Core Principles](#core-principles)
- [Project Structure](#project-structure)
- [Layer-by-Layer Breakdown](#layer-by-layer-breakdown)
- [Module Architecture](#module-architecture)
- [Plugin System](#plugin-system)
- [Request Flow](#request-flow)
- [Best Practices](#best-practices)

## Introduction

This project follows a **modular, layered architecture** designed for scalability, maintainability, and testability. Built with Elysia.js and Bun, it leverages modern TypeScript patterns and functional programming principles to create a robust backend API.

### Key Architectural Goals

1. **Separation of Concerns**: Each layer has a distinct responsibility
2. **Modularity**: Features are self-contained and can be developed independently
3. **Testability**: Clear boundaries make unit and integration testing straightforward
4. **Scalability**: Easy to add new features or extract to microservices
5. **Type Safety**: Full TypeScript coverage with strict mode enabled
6. **Developer Experience**: Consistent patterns and clear file organization

## Core Principles

### 1. Plugin-Based Architecture

Every module exports an Elysia plugin that can be composed into the main application. This allows for:

- Clean separation of routes and business logic
- Easy feature toggling
- Better code organization
- Simplified testing

### 2. Layered Structure

```
Request → Middleware → Controller → Service → Repository → Database
                                                     ↓
Response ← Transformer ← Controller ← Service ← Repository
```

### 3. Dependency Injection Ready

Services and repositories are designed as classes or functions that accept dependencies, making them:

- Easy to test with mocks
- Flexible for different implementations
- Clear about their dependencies

## Project Structure

```
.
├── src/
│   ├── index.ts              # Application entry point
│   ├── app.ts                # Main Elysia instance
│   ├── config/               # Configuration layer
│   └── app/                  # Application layer
│       ├── modules/          # Feature modules
│       ├── plugins/          # Global plugins
│       ├── middleware/       # Middleware functions
│       ├── utils/            # Utility functions
│       └── types/            # Type definitions
├── docs/                     # Documentation
├── test/                     # Test suites
├── .github/                  # CI/CD workflows
├── .husky/                   # Git hooks
└── docker/                   # Docker configurations
```

## Layer-by-Layer Breakdown

### 1. Entry Point Layer (`src/`)

#### `index.ts` - Application Entry Point

**Purpose**: Bootstrap the application and handle graceful shutdown

**Responsibilities**:

- Load environment variables
- Validate configuration
- Initialize database connections
- Start the HTTP server
- Handle process signals (SIGTERM, SIGINT)
- Perform graceful shutdown

**Example Structure**:

```typescript
// Load environment
// Validate env vars
// Connect to database
// Start server
// Setup signal handlers
// Graceful shutdown logic
```

#### `app.ts` - Main Elysia Instance

**Purpose**: Compose all plugins and middleware into the main application

**Responsibilities**:

- Create Elysia instance
- Register global plugins (CORS, logger, error handler)
- Register feature modules
- Configure Swagger documentation
- Set up health checks

**Why Separate from index.ts?**

- Makes the app instance testable
- Allows reuse in tests without starting the server
- Clean separation of app composition and server lifecycle

### 2. Configuration Layer (`src/config/`)

#### `env.ts` - Environment Configuration

**Purpose**: Centralize all environment variables with validation

**Why it exists**:

- Single source of truth for configuration
- Type-safe access to env vars
- Validation on startup (fail fast)
- Default values for development
- Prevents runtime errors from missing variables

**Pattern**:

```typescript
export const env = {
  PORT: Number(process.env.PORT) || 3000,
  // ... other vars
};

export function validateEnv() {
  // Validate required vars
}
```

#### `constants.ts` - Application Constants

**Purpose**: Define application-wide constants

**Contains**:

- HTTP status codes
- Error codes
- Cache TTL values
- Pagination defaults
- API prefixes

**Why separate from env.ts?**

- These are constants, not configurable
- Can be imported anywhere without circular dependencies
- Makes code more readable and maintainable

#### `database.ts` - Database Configuration

**Purpose**: Database connection management

**Responsibilities**:

- Create database connection singleton
- Handle connection lifecycle
- Provide connection pooling configuration
- Export database client instance

**Why a singleton?**

- Prevents multiple connections
- Easy to manage lifecycle
- Can be mocked in tests

### 3. Application Layer (`src/app/`)

This is where your business logic lives. It's structured into several sub-layers:

---

### 3.1 Modules Layer (`src/app/modules/`)

Modules are **self-contained feature sets** following a consistent structure.

#### Module Structure (Example: Users Module)

```
users/
├── users.module.ts       # Plugin export
├── users.controller.ts   # Route handlers
├── users.service.ts      # Business logic
├── users.repository.ts   # Data access
└── users.types.ts        # Type definitions
```

#### `users.module.ts` - Module Plugin

**Purpose**: Export an Elysia plugin that registers all routes

**Why**:

- Encapsulates the entire feature
- Easy to enable/disable features
- Clean composition in main app
- Can be tested independently

**Pattern**:

```typescript
export const usersModule = new Elysia({ prefix: "/users" })
  .use(authMiddleware)
  .get("/", controller.getUsers)
  .post("/", controller.createUser);
// ... other routes
```

#### `users.controller.ts` - Route Handlers

**Purpose**: Handle HTTP requests and responses

**Responsibilities**:

- Parse and validate request data
- Call service layer methods
- Format responses
- Handle errors (delegated to error handler)

**What it DOESN'T do**:

- Business logic (that's in service)
- Database queries (that's in repository)
- Response transformation (that's in transformer plugin)

**Pattern**:

```typescript
export const controller = {
  getUsers: async ({ query }) => {
    const users = await service.findAll(query);
    return users;
  },
};
```

#### `users.service.ts` - Business Logic

**Purpose**: Implement business rules and orchestrate data operations

**Responsibilities**:

- Validate business rules
- Orchestrate multiple repository calls
- Transform data between layers
- Handle business exceptions
- Implement complex workflows

**What it DOESN'T do**:

- Handle HTTP concerns
- Execute SQL/database queries directly
- Know about request/response formats

**Why separate from controller?**

- Testable without HTTP mocking
- Reusable across different interfaces (API, CLI, queue workers)
- Clear business logic location

**Pattern**:

```typescript
export class UserService {
  constructor(private repo: UserRepository) {}

  async createUser(data: CreateUserDto) {
    // Business validation
    // Password hashing
    // Call repository
    // Return user
  }
}
```

#### `users.repository.ts` - Data Access Layer

**Purpose**: Database operations and queries

**Responsibilities**:

- Execute database queries
- Map database models to domain models
- Handle database errors
- Implement query optimization

**What it DOESN'T do**:

- Business logic
- Validation (except database constraints)
- HTTP concerns

**Why separate from service?**

- Easy to swap database implementations
- Testable with database mocks
- Centralized query logic
- Easier to optimize queries

**Pattern**:

```typescript
export class UserRepository {
  async findById(id: string) {
    // Database query
    return user;
  }

  async create(data: User) {
    // Insert query
    return newUser;
  }
}
```

#### `users.types.ts` - Type Definitions

**Purpose**: Define TypeScript interfaces and types for the module

**Contains**:

- Domain models
- DTOs (Data Transfer Objects)
- Request/Response types
- Validation schemas

**Why separate?**

- Prevents circular dependencies
- Easy to find types
- Shareable across layers
- Can be used in API documentation

---

### 3.2 Plugins Layer (`src/app/plugins/`)

Plugins are **globally applied** to all routes (or can be selectively applied).

#### `error-handler.plugin.ts`

**Purpose**: Centralized error handling

**Why**:

- Consistent error responses
- Logging of errors
- Transform exceptions to HTTP responses
- Hide internal errors in production

**When it runs**: After route handler throws an error

#### `response-transformer.plugin.ts`

**Purpose**: Standardize all API responses

**Why**:

- Consistent response format
- Add metadata (timestamps, request IDs)
- Easier for API consumers
- Can add pagination info

**Pattern**:

```typescript
{
  success: true,
  data: {...},
  meta: {
    timestamp: "...",
    requestId: "..."
  }
}
```

#### `logger.plugin.ts`

**Purpose**: Log all incoming requests and responses

**Why**:

- Debugging and monitoring
- Performance tracking
- Audit trail
- Generate request IDs

**What it logs**:

- Request method, URL, headers
- Request/response time
- Status code
- User information (if authenticated)

#### `rate-limiter.plugin.ts`

**Purpose**: Prevent API abuse

**Why**:

- Protect against DDoS
- Prevent brute force attacks
- Fair usage enforcement
- Cost control

**Implementation**: Usually uses Redis or in-memory store

#### `cors.plugin.ts`

**Purpose**: Configure Cross-Origin Resource Sharing

**Why**:

- Allow frontend apps to access API
- Configure allowed origins
- Handle preflight requests
- Security control

#### `swagger.plugin.ts`

**Purpose**: Auto-generate API documentation

**Why**:

- Interactive API docs
- No manual doc maintenance
- Test API in browser
- Generate client SDKs

---

### 3.3 Middleware Layer (`src/app/middleware/`)

Middleware runs **before** route handlers.

#### `auth.middleware.ts`

**Purpose**: Verify JWT tokens and authenticate users

**When to use**:

- Protect routes that require authentication
- Extract user from token
- Verify token validity

**Pattern**:

```typescript
export const authMiddleware = async ({ headers, set }) => {
  // Extract token
  // Verify token
  // Attach user to context
  // Or throw 401
};
```

#### `validation.middleware.ts`

**Purpose**: Validate request data against schemas

**When to use**:

- Validate request body
- Validate query parameters
- Validate route params
- Transform/sanitize data

**Why separate from controller?**

- Reusable validation logic
- Fails fast before business logic
- Clear error messages

---

### 3.4 Utils Layer (`src/app/utils/`)

Utility functions used across the application.

#### `logger.ts`

**Purpose**: Logging utility wrapper

**Why**:

- Consistent log format
- Easy to change logging library
- Structured logging
- Log levels (info, error, debug)

#### `jwt.ts`

**Purpose**: JWT token operations

**Functions**:

- `generateToken()` - Create JWT
- `verifyToken()` - Validate JWT
- `decodeToken()` - Extract payload

**Why separate?**

- Reusable across auth flows
- Easy to test
- Centralized JWT logic

#### `hash.ts`

**Purpose**: Password hashing utilities

**Functions**:

- `hashPassword()` - Hash passwords
- `comparePassword()` - Verify passwords

**Why**:

- Security best practices
- Consistent hashing algorithm
- Easy to upgrade hashing strategy

#### `response.ts`

**Purpose**: Response helper functions

**Functions**:

- `success()` - Format success response
- `error()` - Format error response
- `paginate()` - Add pagination metadata

**Why**:

- DRY principle
- Consistent responses
- Easier to change format

---

### 3.5 Types Layer (`src/app/types/`)

#### `common.types.ts`

**Purpose**: Shared types used across modules

**Contains**:

- Common interfaces
- Shared DTOs
- Utility types
- Generic types

#### `env.d.ts`

**Purpose**: Extend global types and environment

**Contains**:

- Process.env type augmentation
- Global type declarations
- Elysia context extensions

#### `index.ts`

**Purpose**: Re-export commonly used types

**Why**:

- Single import point
- Cleaner imports
- Better organization

---

## Module Architecture

### Module Lifecycle

1. **Module Definition**: Create module folder with standard structure
2. **Type Definition**: Define types in `*.types.ts`
3. **Repository**: Implement data access in `*.repository.ts`
4. **Service**: Implement business logic in `*.service.ts`
5. **Controller**: Create route handlers in `*.controller.ts`
6. **Module Export**: Compose into plugin in `*.module.ts`
7. **Register**: Import and use in `app.ts`

### Module Communication

**Option 1: Direct Service Imports**

```typescript
// In users.service.ts
import { AuthService } from "../auth/auth.service";
```

**Option 2: Dependency Injection**

```typescript
export class UserService {
  constructor(private repo: UserRepository, private authService: AuthService) {}
}
```

**Option 3: Events/Message Queue** (for decoupling)

```typescript
eventEmitter.on("user.created", handleUserCreated);
```

---

## Plugin System

### Plugin Order Matters

```typescript
// In app.ts
const app = new Elysia()
  .use(loggerPlugin) // 1. Log first
  .use(errorHandlerPlugin) // 2. Catch errors
  .use(corsPlugin) // 3. CORS headers
  .use(rateLimiterPlugin) // 4. Rate limit
  .use(responseTransformer) // 5. Transform responses
  .use(swaggerPlugin) // 6. Docs
  .use(healthModule) // 7. Feature modules
  .use(authModule)
  .use(usersModule);
```

### Plugin Scope

- **Global**: Applied to all routes
- **Group**: Applied to route groups
- **Route**: Applied to specific routes

---

## Request Flow

### Authenticated Request Example

```
1. Client sends request
   ↓
2. Logger plugin (log request)
   ↓
3. CORS plugin (add headers)
   ↓
4. Rate limiter (check limits)
   ↓
5. Auth middleware (verify token)
   ↓
6. Validation middleware (validate data)
   ↓
7. Controller (handle request)
   ↓
8. Service (business logic)
   ↓
9. Repository (database query)
   ↓
10. Service (process result)
    ↓
11. Controller (return data)
    ↓
12. Response transformer (format response)
    ↓
13. Logger plugin (log response)
    ↓
14. Client receives response
```

### Error Flow

```
Error thrown at any point
   ↓
Bubbles up to error handler plugin
   ↓
Error handler formats error
   ↓
Logger logs error
   ↓
Client receives error response
```

---

## Best Practices

### 1. Keep Controllers Thin

Controllers should only handle HTTP concerns. Business logic goes in services.

### 2. Services Don't Know About HTTP

Services return data, not HTTP responses. They throw business exceptions.

### 3. Repositories Only Do Data Access

No business logic in repositories. Just CRUD operations.

### 4. Use Types Everywhere

Full TypeScript coverage prevents runtime errors.

### 5. Test Each Layer Independently

- Unit test services and repositories
- Integration test controllers
- E2E test full flows

### 6. One File, One Responsibility

Each file should have a single, clear purpose.

### 7. Export Plugins, Not Apps

Modules export plugins that can be composed, not full apps.

### 8. Consistent Naming

- `*.module.ts` - Plugin export
- `*.controller.ts` - Route handlers
- `*.service.ts` - Business logic
- `*.repository.ts` - Data access
- `*.types.ts` - Type definitions

### 9. Async/Await Everywhere

Use async/await for all asynchronous operations.

### 10. Validate Early

Validate input at the controller/middleware level before processing.

---

## Adding a New Module

See `docs/guides/adding-new-module.md` for a step-by-step guide.

## Testing Strategy

See `docs/guides/testing.md` for testing patterns and examples.

## Deployment

See `docs/guides/deployment.md` for deployment instructions.
