---
name: advanced-tables-cli
description: Use this skill when an OpenClaw agent needs to detect or normalize markdown tables for the Obsidian Advanced Tables plugin.
---

# Advanced Tables CLI

Use this repo's CLI to inspect or lightly format markdown tables. Always pass `--vault <vault>`.

```bash
PLUGIN_REPO=/path/to/advanced-tables-obsidian
npm --prefix "$PLUGIN_REPO" run cli-build
node "$PLUGIN_REPO/openclaw-advanced-tables-cli.cjs" list --vault <vault> --path "Notes/Table.md"
```

Format a note's markdown tables:

```bash
node "$PLUGIN_REPO/openclaw-advanced-tables-cli.cjs" format --vault <vault> --path "Notes/Table.md"
```

If installed or linked, `advanced-tables-cli ...` may be used instead.

## Safety

- Prefer `--dry-run` before formatting.
- The formatter normalizes pipe spacing; it is not a formula evaluator.
- Treat `ok: false` or nonzero exit as failure and report `error.message`.

