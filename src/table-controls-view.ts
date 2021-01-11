import { icons } from './icons';
import { TableEditorPluginSettings } from './settings';
import { TableEditor } from './table-editor';
import { ItemView, MarkdownView, Notice, TFile, WorkspaceLeaf } from 'obsidian';

export const TableControlsViewType = 'advanced-tables-toolbar';

export class TableControlsView extends ItemView {
  private mostRecentFile: TFile;
  private readonly settings: TableEditorPluginSettings;

  constructor(leaf: WorkspaceLeaf, settings: TableEditorPluginSettings) {
    super(leaf);
    this.settings = settings;
  }

  public getViewType(): string {
    return TableControlsViewType;
  }

  public getDisplayText(): string {
    return 'Advanced Tables';
  }

  public getIcon(): string {
    return 'spreadsheet';
  }

  public load(): void {
    super.load();
    this.registerEvent(
      this.app.workspace.on('file-open', this.storeMostRecentFile),
    );
    this.draw();
  }

  private readonly draw = (): void => {
    const container = this.containerEl.children[1];

    const rootEl = document.createElement('div');

    const navHeader = rootEl.createDiv({ cls: 'nav-header' });
    const rowOneBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    this.drawBtn(rowOneBtns, 'alignLeft', (te) => te.leftAlignColumn());
    this.drawBtn(rowOneBtns, 'alignCenter', (te) => te.centerAlignColumn());
    this.drawBtn(rowOneBtns, 'alignRight', (te) => te.rightAlignColumn());

    const rowTwoBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    this.drawBtn(rowTwoBtns, 'moveRowDown', (te) => te.moveRowDown());
    this.drawBtn(rowTwoBtns, 'moveRowUp', (te) => te.moveRowUp());
    this.drawBtn(rowTwoBtns, 'moveColumnRight', (te) => te.moveColumnRight());
    this.drawBtn(rowTwoBtns, 'moveColumnLeft', (te) => te.moveColumnLeft());

    const rowThreeBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    this.drawBtn(rowThreeBtns, 'insertRow', (te) => te.insertRow());
    this.drawBtn(rowThreeBtns, 'insertColumn', (te) => te.insertColumn());
    this.drawBtn(rowThreeBtns, 'deleteRow', (te) => te.deleteRow());
    this.drawBtn(rowThreeBtns, 'deleteColumn', (te) => te.deleteColumn());

    const rowFourBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    this.drawBtn(rowFourBtns, 'sortAsc', (te) => te.sortRowsAsc());
    this.drawBtn(rowFourBtns, 'sortDesc', (te) => te.sortRowsDesc());
    this.drawBtn(rowFourBtns, 'formula', (te) => te.evaluateFormulas());
    this.drawBtn(rowFourBtns, 'help', () =>
      window.open(
        'https://github.com/tgrosinger/advanced-tables-obsidian/blob/main/docs/help.md',
      ),
    );

    container.empty();
    container.appendChild(rootEl);
  };

  private readonly drawBtn = (
    parent: HTMLDivElement,
    iconName: string,
    fn: (te: TableEditor) => void,
  ): void => {
    const button = parent.createDiv({ cls: 'nav-action-button' });
    button.onClickEvent(() => this.withTE(fn));
    button.appendChild(Element(icons[iconName]));
  };

  private readonly storeMostRecentFile = (file: TFile): void => {
    if (!file) {
      return;
    }
    this.mostRecentFile = file;
  };

  private readonly withTE = (
    fn: (te: TableEditor) => void,
    alertOnNoTable = true,
  ): void => {
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

  private readonly withCM = (fn: (cm: CodeMirror.Editor) => void): void => {
    if (!this.mostRecentFile) {
      new Notice('Advanced Tables: Cannot find a recently edited file');
      return;
    }

    const leaf = this.app.workspace
      .getLeavesOfType('markdown')
      .filter(
        // We are using a feature which is not exposed in the API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (l) => (l.view as any).file.basename === this.mostRecentFile.basename,
      )
      .first();

    if (!leaf) {
      console.error('Could not find a leaf for the last known file opened');
      new Notice('Advanced Tables: Cannot find a recently edited file');
      return;
    }

    if (leaf.view instanceof MarkdownView) {
      fn(leaf.view.sourceMode.cmEditor);
    }
  };
}

/**
 * Convert an svg string into an HTML element.
 *
 * @param svgText svg image as a string
 */
const Element = (svgText: string): HTMLElement => {
  const parser = new DOMParser();
  return parser.parseFromString(svgText, 'text/xml').documentElement;
};
