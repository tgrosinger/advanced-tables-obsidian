#!/usr/bin/env node
"use strict";

process.env.OPENCLAW_PLUGIN_CONFIG = JSON.stringify({
  pluginId: "table-editor-obsidian",
  installedId: "table-editor-obsidian",
  bin: "advanced-tables-cli",
  domain: "tables",
  capabilities: ["settings", "markdown-table-format"],
  commands: ["list", "format"],
});
require("./openclaw-plugin-cli.cjs");
