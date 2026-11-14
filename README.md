# redminetracker

Electron + Vue 3 time tracker for Redmine.

## Requirements
Node.js 24 or newer (see `.nvmrc`; `nvm use`).

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles for production
```
npm run build
```

### Packages installers (output in `dist_electron/`)
```
npm run package
```

### Lints
```
npm run lint
```

Note: `npm audit` reports moderate advisories (minimatch) in the dev-only
`electron-builder` chain; they do not ship in the app (`npm audit --omit=dev` is clean).
