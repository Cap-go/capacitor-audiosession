# Example App for `@capgo/capacitor-audio-session`

This Vite + TypeScript project links to the local plugin so you can exercise the iOS audio session APIs while developing.

## Playground actions

- **Refresh routes**: reads `currentOutputs()` and lists active output ports.
- **Override output**: calls `overrideOutput('speaker')` or `overrideOutput('default')`.
- **Live events**: subscribes to `routeChanged` and `interruption` and appends to the event log.
- **Plugin version**: calls `getPluginVersion()`.

Audio session routing is **iOS only**. Android and web builds show a friendly unsupported state in the UI.

## Getting started

From the repository root:

```bash
bun install
bun run build
```

From `example-app`:

```bash
bun install
bun run start
```

From the repository root:

```bash
bun run example:build
```

Add native shells with `bunx cap add ios` or `bunx cap add android` from this folder to try behavior on device or simulator.
