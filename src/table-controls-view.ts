import {
  EventRef,
  ItemView,
  MarkdownView,
  Menu,
  Notice,
  TFile,
  WorkspaceLeaf,
} from 'obsidian';
import { TableEditorPluginSettings } from './settings';
import { TableEditor } from './table-editor';

export const TableControlsViewType = 'advanced-tables-toolbar';

export class TableControlsView extends ItemView {
  private listeners: EventRef[];
  private mostRecentFile: TFile;
  private settings: TableEditorPluginSettings;

  constructor(leaf: WorkspaceLeaf, settings: TableEditorPluginSettings) {
    super(leaf);

    this.settings = settings;

    // Add buttons in reverse order

    this.addAction('help', 'Help', () =>
      window.open(
        'https://github.com/tgrosinger/advanced-tables-obsidian/blob/main/docs/help.md',
      ),
    );
    this.addAction('formula', 'Evaluate formulas', () =>
      this.withTE((te) => {
        te.evaluateFormulas();
      }),
    );
    this.addAction('deleteRow', 'Delete row', () =>
      this.withTE((te) => {
        te.deleteRow();
      }),
    );
    this.addAction('deleteColumn', 'Delete column', () =>
      this.withTE((te) => {
        te.deleteColumn();
      }),
    );
    this.addAction('insertRow', 'Insert row', () =>
      this.withTE((te) => {
        te.insertRow();
      }),
    );
    this.addAction('insertColumn', 'Insert column', () =>
      this.withTE((te) => {
        te.insertColumn();
      }),
    );
    this.addAction('moveRowDown', 'Move row down', () =>
      this.withTE((te) => {
        te.moveRowDown();
      }),
    );
    this.addAction('moveRowUp', 'Move row up', () =>
      this.withTE((te) => {
        te.moveRowUp();
      }),
    );
    this.addAction('moveColumnRight', 'Move column right', () =>
      this.withTE((te) => {
        te.moveColumnRight();
      }),
    );
    this.addAction('moveColumnLeft', 'Move column left', () =>
      this.withTE((te) => {
        te.moveColumnLeft();
      }),
    );
    this.addAction('sortDesc', 'Sort rows descending', () =>
      this.withTE((te) => {
        te.sortRowsAsc();
      }),
    );
    this.addAction('sortAsc', 'Sort rows ascending', () =>
      this.withTE((te) => {
        te.sortRowsAsc();
      }),
    );
    this.addAction('alignRight', 'Align Column Right', () =>
      this.withTE((te) => {
        te.rightAlignColumn();
      }),
    );
    this.addAction('alignCenter', 'Align Column Center', () =>
      this.withTE((te) => {
        te.centerAlignColumn();
      }),
    );
    this.addAction('alignLeft', 'Align Column Left', () =>
      this.withTE((te) => {
        te.leftAlignColumn();
      }),
    );
  }

  getViewType(): string {
    return TableControlsViewType;
  }
  getDisplayText(): string {
    return 'Advanced Tables';
  }
  getIcon(): string {
    return 'spreadsheet';
  }

  async onOpen(): Promise<void> {
    this.listeners = [
      this.app.workspace.on('resize', this.update),
      this.app.workspace.on('click', this.update),
      this.app.workspace.on('layout-ready', this.update),
      this.app.workspace.on('layout-change', this.update),
      this.app.workspace.on('file-open', this.storeMostRecentFile),
    ];
  }

  async onClose() {
    this.listeners.forEach((listener) => this.app.workspace.offref(listener));
  }

  private readonly update = () => {
    if (this.containerEl.children.length === 2) {
      this.containerEl.removeChild(this.containerEl.children[1]);
    }
    this.containerEl.parentElement.setAttribute('style', 'flex-grow: 4.3;');
  };

  private readonly storeMostRecentFile = (file: TFile) => {
    if (!file) {
      return;
    }
    this.mostRecentFile = file;
  };

  private readonly withTE = (
    fn: (te: TableEditor) => void,
    alertOnNoTable = true,
  ) => {
    this.withCM((cm: CodeMirror.Editor) => {
      const te = new TableEditor(cm, this.settings);
      if (!te.cursorIsInTable()) {
        if (alertOnNoTable) {
          new Notice('Advanced Tables: Cursor must be in a table.');
        }
        return;
      }

      fn(te);
    });
  };

  private readonly withCM = (fn: (cm: CodeMirror.Editor) => void) => {
    if (!this.mostRecentFile) {
      console.error('No most recent file stored');
      return;
    }

    const leaf = this.app.workspace
      .getLeavesOfType('markdown')
      .filter(
        (leaf) =>
          (leaf.view as any).file.basename === this.mostRecentFile.basename,
      )
      .first();

    if (!leaf) {
      console.error('Could not find a leaf for the last known file opened');
      return;
    }

    if (leaf.view instanceof MarkdownView) {
      fn(leaf.view.sourceMode.cmEditor);
    }
  };
}
