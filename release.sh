#!/bin/bash

rm -rf table-editor-obsidian
mkdir table-editor-obsidian
cp README.md main.js manifest.json table-editor-obsidian
zip -r table-editor-obsidian_v${1}.zip table-editor-obsidian