# redminetracker

A small desktop time tracker for [Redmine](https://www.redmine.org/). It lists the issues you work on, and with one click it starts tracking time against an issue and writes the time entries to Redmine for you. Built with Electron and Vue 3; runs on macOS, Windows and Linux.

## What it does

- **Issue list** – shows issues that are assigned to you or that you watch, across one or more Redmine instances. Each entry shows the issue number, project, subject, due date (`Bis`), estimated hours (`Max`), hours already booked (`Ist`) and the done ratio (`Done`).
- **Search** – the search box filters the list by issue number, subject, description or project name. If you type a number that is not in the list, the issue with that number is fetched from Redmine and added.
- **Time tracking** – press the play button on an issue to start tracking. The tracker bar at the top shows the issue, the elapsed minutes and an editable comment.
  - On start, a time entry of 0.25 h is created in Redmine (today's date, your default activity and comment).
  - Every 15 minutes the entry is increased by another 0.25 h.
  - Press stop to finish; the comment you typed is saved to the time entry.
  - Only one issue is tracked at a time. Time only advances while the app is running.
- **Multiple Redmines** – each configured instance appears as a tab. Switching tabs stops the running tracker and loads that instance's issues.
- **Window position** – size and position are remembered between runs.

## Installing

Download the installer for your platform from the [GitHub releases](https://github.com/sudhaus7/redminetracker/releases): `.dmg` / `.zip` (macOS, arm64, unsigned), `Setup .exe` (Windows), `.AppImage` or `.snap` (Linux).

On macOS the app is not signed. If Gatekeeper blocks it, right-click the app and choose *Open*, or run `xattr -dr com.apple.quarantine /Applications/redminetracker.app`.

## Configuration

### 1. Enable the Redmine REST API
In Redmine, an administrator must enable it under *Administration → Settings → API → Enable REST web service*.

### 2. Get your API key
In Redmine open *My account* and use *Show* under *API access key* on the right.

### 3. Add the Redmine in the app
1. Open the settings page (wrench icon in the toolbar) and press **+** to add a configuration.
2. Fill in the fields:

   | Field | Meaning |
   | --- | --- |
   | **Name** | Label shown on the tab, e.g. `Work`. Keep names unique. |
   | **Hostname** | Base URL of your Redmine including the scheme, e.g. `https://redmine.example.com/`. |
   | **ApiKey** | Your personal API key from step 2. |
   | **Default Activity** | Activity booked on new time entries (e.g. Development). Appears after the connection test succeeded. |
   | **Default Tracking comment** | Comment prefilled on new time entries (default `tracking`). You can change it per session in the tracker bar. |

3. Press the connection-test button (air/plane icon). If host and key are valid, the available activities load and a save button appears.
4. Choose the **Default Activity** and press the save (floppy) button. Use the trash button to delete a configuration.

The first configuration is used when the app starts. Restart the app or select the tab after adding or changing a configuration.

Your Redmine user needs permission to log time on the issues you track, and the selected activity must be enabled for the project.

### Where settings are stored
Settings (including the API key, in plain text) are kept in a `config.json` file in the app's user data folder:

- macOS: `~/Library/Application Support/redminetracker/`
- Windows: `%APPDATA%\redminetracker\`
- Linux: `~/.config/redminetracker/`

Protect that file like a password. Settings from versions before 0.4.0 are picked up automatically.

## Development

Requires Node.js 24 or newer (see `.nvmrc`; `nvm use`).

```
npm install
npm run dev        # start with hot reload
npm run build      # compile to out/
npm run package    # build installers into dist_electron/
npm run lint
```

### Structure
- `src/main` – Electron main process: window, settings store, Redmine REST client
- `src/preload` – the only bridge exposed to the UI (`window.api`)
- `src/renderer` – the Vue 3 + Pinia user interface

The UI runs sandboxed with context isolation and no Node.js access; settings and all Redmine requests go through the preload API.

`npm audit` reports moderate advisories (minimatch) in the dev-only `electron-builder` chain; they do not ship in the app (`npm audit --omit=dev` is clean).
