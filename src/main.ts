import { defaultOptions } from './mte-options';
import { Alignment, TableEditor } from '@susisu/mte-kernel';
import { MarkdownView, Plugin } from 'obsidian';
import { ObsidianTextEditor } from 'src/text-editor-interface';

export default class TableEditorPlugin extends Plugin {
  public onInit(): void {}

  public onload(): void {
    console.log('loading markdown-table-editor plugin');

    this.addCommand({
      id: 'format-table',
      name: 'Format table at the cursor',
      callback: () => {
        this.inTableWrapper(this.formatTable);
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
        this.inTableWrapper(this.nextCell);
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
        this.inTableWrapper(this.previousCell);
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
        this.inTableWrapper(this.nextRow);
      },
    });

    this.addCommand({
      id: 'insert-column',
      name: 'Insert column before current',
      callback: () => {
        this.inTableWrapper(this.insertColumn);
      },
    });

    this.addCommand({
      id: 'left-align-column',
      name: 'Left align column',
      callback: () => {
        this.inTableWrapper(this.leftAlignColumn);
      },
    });

    this.addCommand({
      id: 'center-align-column',
      name: 'Center align column',
      callback: () => {
        this.inTableWrapper(this.centerAlignColumn);
      },
    });

    this.addCommand({
      id: 'right-align-column',
      name: 'Right align column',
      callback: () => {
        this.inTableWrapper(this.rightAlignColumn);
      },
    });
  }

  public onunload(): void {
    console.log('unloading markdown-table-editor plugin');
  }

  private readonly inTableWrapper = (
    fn: (tableeditor: TableEditor) => void,
  ): void => {
    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      const ote = new ObsidianTextEditor(activeLeaf.view);
      const te = new TableEditor(ote);

      if (te.cursorIsInTable(defaultOptions)) {
        fn(te);
      }
    }
  };

  private readonly nextCell = (te: TableEditor): void => {
    te.nextCell(defaultOptions);
  };

  private readonly previousCell = (te: TableEditor): void => {
    te.previousCell(defaultOptions);
  };

  private readonly nextRow = (te: TableEditor): void => {
    te.nextRow(defaultOptions);
  };

  private readonly formatTable = (te: TableEditor): void => {
    te.format(defaultOptions);
  };

  private readonly insertColumn = (te: TableEditor): void => {
    te.insertColumn(defaultOptions);
  };

  private readonly leftAlignColumn = (te: TableEditor): void => {
    te.alignColumn(Alignment.LEFT, defaultOptions);
  };

  private readonly centerAlignColumn = (te: TableEditor): void => {
    te.alignColumn(Alignment.CENTER, defaultOptions);
  };

  private readonly rightAlignColumn = (te: TableEditor): void => {
    te.alignColumn(Alignment.RIGHT, defaultOptions);
  };
}
