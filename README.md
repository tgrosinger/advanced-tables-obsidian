# Obsidian Table Editor Plugin

Add improved navigation, formatting, and manipulation to markdown tables in Obsidian:

- [x] Excel-like table navigation (tab/enter between cells and rows)
- [x] Add and remove columns and rows
- [x] Auto formatting
- [x] Move columns left and right
- [x] Move rows up and down
- [x] Set column alignment (left, center, right)
- [x] Sort rows by a specified column
- [ ] [Simple arithmetic formulas](https://github.com/tgrosinger/advanced-tables-obsidian/issues/14)
- [ ] [Your feature here?](https://github.com/tgrosinger/advanced-tables-obsidian/issues/new?assignees=&labels=enhancement%2C+needs-review&template=feature_request.md&title=)

Vote on the features you are interested in with the links above!

## Demo

![basic functionality](https://raw.githubusercontent.com/tgrosinger/advanced-tables-obsidian/main/resources/screenshots/basic-functionality.gif)

If you use a non-monospaced font while editing, it is recommended that you
disable the "Pad cell width" setting under the plugin settings. See [this
forum post](https://forum.obsidian.md/t/monospace-font-in-the-editor/648/10)
for steps on switching your editor to a monospaced font.

**Note:** The Obsidian API is still in early alpha and this plugin may break at any time!

## How to use

When a cursor is in a markdown table...

| Hotkey                                            | Action                      |
| ------------------------------------------------- | --------------------------- |
| <kbd>Tab</kbd>                                    | Next Cell                   |
| <kbd>Shift</kbd> + <kbd>Tab</kbd>                 | Previous Cell               |
| <kbd>Enter</kbd>                                  | Next Row                    |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>D</kbd> | Open table controls toolbar |

Or use the command palette:

- "Open table controls toolbar"
- "Navigate to Next Cell"
- "Navigate to Previous Cell"
- "Navigate to Next Row"
- "Insert column before current"
- "Format table at the cursor"
- "Left align column"
- "Center align column"
- "Right align column"

## Compatibility

Custom plugins are only available for Obsidian v0.9.7+.

The current API of this repo targets Obsidian **v0.9.7**.

## How to install the plugin

### From within Obsidian

From Obsidian v0.9.8, you can activate this plugin within Obsidian by doing the following:

- Open Settings > Third-party plugin
- Make sure Safe mode is **off**
- Click Browse community plugins
- Search for "Table Editor"
- Click Install
- Once installed, close the community plugins window and activate the newly installed plugin

#### Updates

You can follow the same procedure to update the plugin

(Thanks to @deathau for the borrowed installation instructions.)

## Notes

This is very experimental and may features from the library are not yet
implemented. It is possible that there are bugs which may delete data in the
current note. Please make backups!
