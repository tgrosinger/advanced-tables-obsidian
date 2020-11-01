import { ObsidianTextEditor } from './obsidian-text-editor';
import { TableEditorPluginSettings } from './settings';
import { TableControls } from './table-controls';
import { Alignment, TableEditor as MTEEditor } from '@susisu/mte-kernel';

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

  public readonly insertColumn = (): void => {
    this.mte.insertColumn(this.settings.asOptions());
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

  public readonly openTableControls = (): TableControls => {
    const controls = new TableControls(this.editor, this);
    controls.display();
    return controls;
  };
}
