import { ObsidianTextEditor } from './obsidian-text-editor';
import { TableEditorPluginSettings } from './settings';
import {
  Alignment,
  SortOrder,
  TableEditor as MTEEditor,
} from '@tgrosinger/md-advanced-tables';
import { App, Notice } from 'obsidian';

export class TableEditor {
  private readonly settings: TableEditorPluginSettings;
  private readonly editor: CodeMirror.Editor;
  private readonly mte: MTEEditor;

  constructor(cm: CodeMirror.Editor, settings: TableEditorPluginSettings) {
    this.settings = settings;
    this.editor = cm;

    const ote = new ObsidianTextEditor(cm);
    this.mte = new MTEEditor(ote);
  }

  public readonly exportCSV = (): void => {
    this.mte.withCompletedTable(
      this.settings.asOptions(),
      ({ range, lines, formulaLines, table, focus }: any) => {
        // TODO
      }
    );
  };

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
}
