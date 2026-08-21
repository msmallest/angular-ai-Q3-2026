# Angular AI Q3 2026

[Angular's AI docs](https://angular.dev/ai)

["What's New In Angular" AI showcase - Google I/O 2026](https://youtu.be/MbkjTNg2rcg?t=922)

AI topics utilized

- [Skills](https://angular.dev/ai/agent-skills).
  - **About**: "Agent Skills are specialized, domain-specific instructions and capabilities designed for AI agents like Gemini CLI. These skills provide architectural guidance, generate idiomatic Angular code, and help scaffold new projects using modern best practices. By using Agent Skills, you can ensure that the AI agent you are working with has the most up-to-date information about Angular's conventions, reactivity models (like Signals), and project structure."
  - **Configure/install**: Installed with `npx skills add https://github.com/angular/skills`
- [Angular CLI MCP Server](https://angular.dev/ai/mcp).
  - **About**: "The Angular CLI includes a Model Context Protocol (MCP) server that enables AI assistants (like Cursor, Antigravity, JetBrains AI, etc.) to interact directly with the Angular CLI. It provides tools for code generation, workspace analysis, and running builds/tests."
  - **Configure/install**: Configured out of the box with `ng new` and selecting to use AI configuration.
  - Default tools:
    - `ai_tutor` - Launches an interactive AI-powered Angular tutor.
    - `devserver.start` - Asynchronously starts a dev server (`ng serve`). Returns immediately.
    - `devserver.stop` - Stops the dev server.
    - `devserver.wait_for_build` - Returns the logs of the most recent build in a running dev server.
    - `get_best_practices` - Retrieves the Angular Best Practices Guide (crucial for standalone components, typed forms, etc.).
    - `list_projects` - Lists all applications and libraries in the workspace by reading `angular.json`.
    - `onpush_zoneless_migration` - Analyzes code and provides a plan to migrate it to `OnPush` change detection (prerequisite for zoneless).
    - `run_target` - Executes a configured target (e.g., build, test, lint, e2e, deploy).
    - `search_documentation` - Searches the official documentation at `https://angular.dev`.

## About

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
