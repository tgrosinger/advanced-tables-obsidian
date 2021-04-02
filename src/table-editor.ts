import { ObsidianTextEditor } from './obsidian-text-editor';
import { TableEditorPluginSettings } from './settings';
import {
  Alignment,
  SortOrder,
  TableEditor as MTEEditor,
} from '@tgrosinger/md-advanced-tables';
import { App, Editor, Modal, Notice } from 'obsidian';

export class TableEditor {
  private readonly app: App;
  private readonly settings: TableEditorPluginSettings;
  private readonly mte: MTEEditor;

  constructor(app: App, editor: Editor, settings: TableEditorPluginSettings) {
    this.app = app;
    this.settings = settings;

    const ote = new ObsidianTextEditor(editor);
    this.mte = new MTEEditor(ote);
  }

  public readonly cursorIsInTable = (): boolean =>
    this.mte.cursorIsInTable(this.settings.asOptions());

  public readonly nextCell = (): void => {
    this.mte.nextCell(this.settings.asOptions());
  };

  public readonly previousCell = (): void => {
    this.mte.previousCell(this.settings.asOptions());
  };

  public readonly nextRow = (): void => {
    this.mte.nextRow(this.settings.asOptions());
  };

  public readonly formatTable = (): void => {
    this.mte.format(this.settings.asOptions());
  };

  public readonly formatAllTables = (): void => {
    this.mte.formatAll(this.settings.asOptions());
  };

  public readonly insertColumn = (): void => {
    this.mte.insertColumn(this.settings.asOptions());
  };

  public readonly insertRow = (): void => {
    this.mte.insertRow(this.settings.asOptions());
  };

  public readonly leftAlignColumn = (): void => {
    this.mte.alignColumn(Alignment.LEFT, this.settings.asOptions());
  };

  public readonly centerAlignColumn = (): void => {
    this.mte.alignColumn(Alignment.CENTER, this.settings.asOptions());
  };

  public readonly rightAlignColumn = (): void => {
    this.mte.alignColumn(Alignment.RIGHT, this.settings.asOptions());
  };

  public readonly moveColumnLeft = (): void => {
    this.mte.moveColumn(-1, this.settings.asOptions());
  };

  public readonly moveColumnRight = (): void => {
    this.mte.moveColumn(1, this.settings.asOptions());
  };

  public readonly moveRowUp = (): void => {
    this.mte.moveRow(-1, this.settings.asOptions());
  };

  public readonly moveRowDown = (): void => {
    this.mte.moveRow(1, this.settings.asOptions());
  };

  public readonly deleteColumn = (): void => {
    this.mte.deleteColumn(this.settings.asOptions());
  };

  public readonly deleteRow = (): void => {
    this.mte.deleteRow(this.settings.asOptions());
  };

  public readonly sortRowsAsc = (): void => {
    this.mte.sortRows(SortOrder.Ascending, this.settings.asOptions());
  };

  public readonly sortRowsDesc = (): void => {
    this.mte.sortRows(SortOrder.Descending, this.settings.asOptions());
  };

  public readonly escape = (): void => {
    this.mte.escape(this.settings.asOptions());
  };

  public readonly evaluateFormulas = (): void => {
    const err = this.mte.evaluateFormulas(this.settings.asOptions());
    if (err) {
      new Notice(err.message);
    }
  };

  public readonly exportCSVModal = (): void => {
    new CSVModal(this.app, this.mte, this.settings).open();
  };
}

class CSVModal extends Modal {
  private readonly mte: MTEEditor;
  private readonly settings: TableEditorPluginSettings;

  constructor(app: App, mte: MTEEditor, settings: TableEditorPluginSettings) {
    super(app);
    this.mte = mte;
    this.settings = settings;
  }

  public onOpen(): void {
    const { contentEl } = this;
    const div = contentEl.createDiv({
      cls: 'advanced-tables-csv-export',
    });

    const ta = div.createEl('textarea', {
      attr: {
        readonly: true,
      },
    });
    ta.value = this.mte.exportCSV(true, this.settings.asOptions());
    ta.onClickEvent(() => ta.select());

    const lb = div.createEl('label');
    const cb = lb.createEl('input', {
      type: 'checkbox',
      attr: {
        checked: true,
      },
    });
    lb.createSpan().setText('Include table headers');
    cb.onClickEvent(() => {
      ta.value = this.mte.exportCSV(cb.checked, this.settings.asOptions());
    });
  }

  public onClose(): void {
    const { contentEl } = this;
    contentEl.empty();
  }
}
