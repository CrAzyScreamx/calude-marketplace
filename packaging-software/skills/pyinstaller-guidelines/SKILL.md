---
name: pyinstaller-guidelines
description: Invoke BEFORE writing any PyInstaller .spec file or packaging a Python app into a Windows .exe. Encodes onedir build, .spec-driven config, icon/logo, exe naming + embedded version metadata, and frozen-app asset bundling.
---

# pyinstaller-guidelines

Packaging a Python app into a Windows `.exe` with PyInstaller. Use the **Context7 MCP** for current PyInstaller flag/API syntax before writing — do not trust training data for options or spec-file fields.

## Build shape (fixed)
- **onedir**, always. Never `--onefile`. The spec ends in `EXE(...)` + `COLLECT(...)`.
- Drive every build from a committed **`.spec` file**, never raw CLI flags. Generate once with `pyi-makespec`, then hand-edit the spec; rebuild with `pyinstaller <name>.spec`. Commit the spec.
- Build inside a clean venv holding only runtime deps + `pyinstaller`, so nothing extra gets bundled.

## Conditional rules
- **When the app is windowed (GUI):** set `EXE(..., console=False)`. No terminal window opens. Gotcha: when frozen + windowed, `sys.stdout`/`sys.stderr` are `None` — never `print()` for output and guard any stdout writes; route logging to a file instead.
- **When the app is a console/CLI tool:** set `EXE(..., console=True)` (default). The terminal shows stdout/stderr.
- **Always ask the user which of the two this build is** before writing the spec — do not assume.

## Naming
- Set the name in the spec: `EXE(..., name='MyApp')`. It also names the onedir folder.
- Match the product name; no version number in the filename.

## Icon / logo
- Supply a multi-resolution **`.ico`** (16/32/48/256 px in one file). Convert a PNG with Pillow:
  ```python
  from PIL import Image
  Image.open('logo.png').save('assets/app.ico', sizes=[(16,16),(32,32),(48,48),(256,256)])
  ```
- Wire it in: `EXE(..., icon='assets/app.ico')`. Keep the `.ico` under version control in `assets/`.

## Version / metadata (Windows file properties)
- Attach a version resource so Properties → Details shows Company / Version / Copyright.
- Keep a `version_info.txt` (a `VSVersionInfo` block). Scaffold it from any exe with `pyi-grab-version <some.exe> -o version_info.txt`, then edit the `StringStruct` fields: `CompanyName`, `FileDescription`, `FileVersion`, `ProductName`, `ProductVersion`, `LegalCopyright`. Bump the version each release.
- Wire it in: `EXE(..., version='version_info.txt')`.

## Bundling data / assets (must survive freezing)
- Add non-code files through the spec: `Analysis(datas=[('assets/app.ico', 'assets'), ('config/settings.yaml', 'config')])` — each tuple is `(source, dest_dir_in_bundle)`. Prefer spec `datas` over `--add-data`.
- Pull in imports PyInstaller can't detect (dynamic imports, plugins) via `Analysis(hiddenimports=[...])`.
- Resolve every runtime asset path through the frozen base dir — never a bare relative path or `__file__`:
  ```python
  import sys, os
  BASE = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
  logo = os.path.join(BASE, 'assets', 'logo.png')
  ```
  `sys._MEIPASS` is the unpack dir when frozen; the fallback covers running from source.

## Build & verify (the check — required)
- Build: `pyinstaller <name>.spec --clean --noconfirm`.
- Then **launch the exe from `dist/<name>/`** and confirm all four: console/windowed mode is right, the icon shows on the exe file + taskbar, Properties → Details shows the version metadata, and every bundled asset loads. A green build is NOT a pass — the launched exe is.

## Architecture
- One `.spec` per distributable app; keep it small and readable.
- Commit only: the `.spec`, `version_info.txt`, `assets/`, and source. Ignore `build/` and `dist/`.
- Lint the spec (it's Python) with the project's `ruff` if present; there is no type step.
