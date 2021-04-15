# Advanced Tables for Obsidian

Add improved navigation, formatting, and manipulation to markdown tables in Obsidian:

- Auto formatting
- Excel-like table navigation (tab/enter between cells and rows)
- [Spreadsheet formulas!](https://github.com/tgrosinger/advanced-tables-obsidian/blob/main/docs/help.md#using-formulas-in-markdown-tables)
- Add, remove, and move columns and rows
- Set column alignment (left, center, right)
- Sort rows by a specified column
- Export to CSV
- Works on Obsidian Mobile (See notes below)

## Demo

![basic functionality](https://raw.githubusercontent.com/tgrosinger/advanced-tables-obsidian/main/resources/screenshots/basic-functionality.gif)

**Note:** The Obsidian API is still in early alpha and this plugin may break at any time!

## How to use

To create a table, create a single `|` character, then type the table's first
heading and press <kbd>Tab</kbd>. Continue entering headings and pressing
<kbd>Tab</kbd> until all the headings are created. Press <kbd>Enter</kbd> to
go to the first row. Continue filling cells as before, and press
<kbd>Enter</kbd> again for each new row.

When a cursor is in a markdown table...

| Hotkey                                            | Action                      |
| ------------------------------------------------- | --------------------------- |
| <kbd>Tab</kbd>                                    | Next Cell                   |
| <kbd>Shift</kbd> + <kbd>Tab</kbd>                 | Previous Cell               |
| <kbd>Enter</kbd>                                  | Next Row                    |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> | Open table controls sidebar |

Or use the command palette and search "Advanced Tables". There are many
commands available, don't forget to scroll!

## Formulas and Spreadsheets in Markdown!

![formulas demo](https://raw.githubusercontent.com/tgrosinger/advanced-tables-obsidian/main/resources/screenshots/formulas-demo.gif)

For more information on using formulas, visit the
[Help Docs](https://github.com/tgrosinger/advanced-tables-obsidian/blob/main/docs/help.md).

## How to Install

### From within Obsidian

From Obsidian v0.9.8+, you can activate this plugin within Obsidian by doing the following:

- Open Settings > Third-party plugin
- Make sure Safe mode is **off**
- Click Browse community plugins
- Search for "Advanced Tables"
- Click Install
- Once installed, close the community plugins window and activate the newly installed plugin

## Obsidian Mobile

When using Obsidian on a mobile device, the Advanced Tables plugin can be
used. Using <kbd>Enter</kbd> and <kbd>Tab</kbd> to navigate the table is not
yet functional, but you can create new rows and columns using the buttons in
the Advanced Tables sidebar.

## Pricing

This plugin is provided to everyone for free, however if you would like to
say thanks or help support continued development, feel free to send a little
my way through one of the following methods:

[![GitHub Sponsors](https://img.shields.io/github/sponsors/tgrosinger?style=social)](https://github.com/sponsors/tgrosinger)
[![Paypal](https://img.shields.io/badge/paypal-tgrosinger-yellow?style=social&logo=paypal)](https://paypal.me/tgrosinger)
[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="BuyMeACoffee" width="100">](https://www.buymeacoffee.com/tgrosinger)

## Notes

This is experimental and may have instability. It is possible that there are
bugs which may delete data in the current note. Please make backups!
