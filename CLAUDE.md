# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS application for project management. The application runs on port 3000 by default.

## Development Commands

```bash
# Install dependencies
npm install

# Development
npm run start:dev          # Start with hot-reload
npm run start:debug        # Start with debugging enabled

# Building
npm run build              # Compile TypeScript to dist/

# Production
npm run start:prod         # Run compiled application

# Code Quality
npm run lint               # Run ESLint with auto-fix
npm run format             # Format code with Prettier

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run tests with coverage
npm run test:debug         # Run tests with debugger
npm run test:e2e           # Run end-to-end tests
```

## Architecture

### NestJS Module Structure

The application follows NestJS's modular architecture:

- **Modules**: Organize the application into cohesive blocks of functionality. Each module encapsulates related components.
- **Controllers**: Handle incoming HTTP requests and return responses. Defined with `@Controller()` decorator.
- **Services/Providers**: Contain business logic and are injected into controllers via dependency injection. Defined with `@Injectable()` decorator.
- **Entry Point**: `src/main.ts` bootstraps the application using `NestFactory.create()`.

The root module `AppModule` imports all feature modules and is the starting point for the application graph.

### Testing

- Unit tests: Located alongside source files with `.spec.ts` extension
- E2E tests: Located in `test/` directory with `.e2e-spec.ts` extension
- Jest configuration is in `package.json` with unit tests rooted in `src/` and e2e tests using `test/jest-e2e.json`

## Code Generation

Use NestJS CLI to generate boilerplate:

```bash
nest generate module <name>       # Generate a module
nest generate controller <name>   # Generate a controller
nest generate service <name>      # Generate a service
nest generate resource <name>     # Generate full CRUD resource
```

## TypeScript Configuration

- Target: ES2021
- Module: CommonJS
- Output: `dist/` directory
- Decorators and metadata reflection are enabled for NestJS functionality
- Source maps enabled for debugging
