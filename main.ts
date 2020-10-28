import { TableEditor } from '@susisu/mte-kernel';
import { defaultOptions } from 'mte-options';
import { MarkdownView, Plugin } from 'obsidian';
import { ObsidianTextEditor } from 'text-editor-interface';

export default class TableEditorPlugin extends Plugin {
  onInit() {}

  onload() {
    console.log('loading markdown-table-editor plugin');

    this.addCommand({
      id: 'format-table',
      name: 'Format table at the cursor',
      callback: () => {
        this.formatTable();
      },
    });

    this.addCommand({
      id: 'next-cell',
      name: 'Navigate to Next Cell',
      hotkeys: [
        {
          modifiers: ['Mod'],
          key: 'tab',
        },
      ],
      callback: () => {
        this.nextCell();
      },
    });

    this.addCommand({
      id: 'previous-cell',
      name: 'Navigate to Previous Cell',
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 'tab',
        },
      ],
      callback: () => {
        this.previousCell();
      },
    });
  }

  onunload() {
    console.log('unloading markdown-table-editor plugin');
  }

  nextCell = () => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      let ote = new ObsidianTextEditor(activeLeaf.view);
      let te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        te.nextCell(defaultOptions);
      }
    }
  };

  previousCell = () => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      let ote = new ObsidianTextEditor(activeLeaf.view);
      let te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        te.previousCell(defaultOptions);
      }
    }
  };

  formatTable = () => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      let ote = new ObsidianTextEditor(activeLeaf.view);
      let te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        te.format(defaultOptions);
      }
    }
  };
}
