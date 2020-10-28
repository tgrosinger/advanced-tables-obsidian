import { TableEditor } from '@susisu/mte-kernel';
import { defaultOptions } from 'mte-options';
import { MarkdownView, Plugin } from 'obsidian';
import { ObsidianTextEditor } from 'text-editor-interface';

export default class TableEditorPlugin extends Plugin {
  public onInit(): void {}

  public onload(): void {
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

    this.addCommand({
      id: 'next-row',
      name: 'Navigate to Next Row',
      hotkeys: [
        {
          modifiers: ['Mod'],
          key: 'enter',
        },
      ],
      callback: () => {
        this.nextRow();
      },
    });
  }

  public onunload(): void {
    console.log('unloading markdown-table-editor plugin');
  }

  private readonly nextCell = (): void => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      const ote = new ObsidianTextEditor(activeLeaf.view);
      const te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        te.nextCell(defaultOptions);
      }
    }
  };

  private readonly previousCell = (): void => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      const ote = new ObsidianTextEditor(activeLeaf.view);
      const te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        te.previousCell(defaultOptions);
      }
    }
  };

  private readonly nextRow = (): void => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      const ote = new ObsidianTextEditor(activeLeaf.view);
      const te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        te.nextRow(defaultOptions);
      }
    }
  };

  private readonly formatTable = (): void => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      const ote = new ObsidianTextEditor(activeLeaf.view);
      const te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        te.format(defaultOptions);
      }
    }
  };
}
