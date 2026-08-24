# Zameen Vivaad AI — simplified export

This folder contains two usable representations of the app.

- index.html is the browser-ready static entry point.
- styles.css and app.js are convenient named copies of the bundled assets. The original hashed assets remain in assets/.
- react-source/ contains the modular React/TSX source, including the app shell, screen modules, shared UI, data, and types.

The static export is generated from the same production build as the React app, so behavior and styling stay aligned. Re-run pnpm export:simple after changing source files.
