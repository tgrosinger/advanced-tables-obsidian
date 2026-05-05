---
name: advanced-tables-cli
description: Use this skill when an OpenClaw agent needs to detect or normalize markdown tables for the Obsidian Advanced Tables plugin.
---

# Advanced Tables CLI

Use the CLI shipped in the installed plugin folder. Always pass `--vault <vault>`.

```bash
VAULT=/path/to/vault
CLI="$VAULT/.obsidian/plugins/table-editor-obsidian/openclaw-advanced-tables-cli.cjs"
node "$CLI" list --vault "$VAULT" --path "Notes/Table.md"
```

Format a note's markdown tables:

```bash
node "$CLI" format --vault "$VAULT" --path "Notes/Table.md"
```

If the installed plugin does not include the CLI yet, use `advanced-tables-cli` from `PATH` or `node "$PLUGIN_REPO/openclaw-advanced-tables-cli.cjs"` from a checkout.

## Safety

- Prefer `--dry-run` before formatting.
- The formatter normalizes pipe spacing; it is not a formula evaluator.
- Treat `ok: false` or nonzero exit as failure and report `error.message`.

