import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, process.argv[2] || 'exports/simple');
const buildDir = join(output, '.vite-build');

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

execFileSync(resolve(root, 'node_modules/.bin/vite'), ['build', '--outDir', buildDir, '--emptyOutDir'], {
  cwd: root,
  stdio: 'inherit',
});

const builtHtml = await readFile(join(buildDir, 'index.html'), 'utf8');
const html = builtHtml.replaceAll('/assets/', 'assets/');
await writeFile(join(output, 'index.html'), html);
await cp(join(buildDir, 'assets'), join(output, 'assets'), { recursive: true });

const assetNames = await readdir(join(output, 'assets'));
const css = assetNames.find((name) => name.endsWith('.css'));
const js = assetNames.find((name) => name.endsWith('.js'));
if (css) await cp(join(output, 'assets', css), join(output, 'styles.css'));
if (js) await cp(join(output, 'assets', js), join(output, 'app.js'));

const reactSource = join(output, 'react-source');
await mkdir(reactSource, { recursive: true });
for (const relative of ['src/App.tsx', 'src/index.css', 'src/types.ts', 'src/data', 'src/components', 'src/app', 'src/lib']) {
  const from = join(root, relative);
  if (existsSync(from)) await cp(from, join(reactSource, relative), { recursive: true });
}

const readme = [
  '# Zameen Vivaad AI — simplified export',
  '',
  'This folder contains two usable representations of the app.',
  '',
  '- index.html is the browser-ready static entry point.',
  '- styles.css and app.js are convenient named copies of the bundled assets. The original hashed assets remain in assets/.',
  '- react-source/ contains the modular React/TSX source, including the app shell, screen modules, shared UI, data, and types.',
  '',
  'The static export is generated from the same production build as the React app, so behavior and styling stay aligned. Re-run pnpm export:simple after changing source files.',
  '',
].join('\n');
await writeFile(join(output, 'README.md'), readme);

await rm(buildDir, { recursive: true, force: true });
console.log(`Simple export written to ${output}`);
