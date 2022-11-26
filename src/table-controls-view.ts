import { icons } from './icons';
import { TableEditorPluginSettings } from './settings';
import { TableEditor } from './table-editor';
import {
  Editor,
  ItemView,
  MarkdownView,
  Notice,
  WorkspaceLeaf,
} from 'obsidian';

export const TableControlsViewType = 'advanced-tables-toolbar';

export class TableControlsView extends ItemView {
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
    this.draw();
  }

  private readonly draw = (): void => {
    const container = this.containerEl.children[1];

    const rootEl = document.createElement('div');
    rootEl.addClass("advanced-tables-buttons");

    rootEl.createDiv().
      createSpan({ cls: 'title' }).
      setText("Advanced Tables")

    const navHeader = rootEl.createDiv({ cls: 'nav-header' });
    const rowOneBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowOneBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText("Align:");
    this.drawBtn(rowOneBtns, 'alignLeft', 'left align column', (te) =>
      te.leftAlignColumn(),
    );
    this.drawBtn(rowOneBtns, 'alignCenter', 'center align column', (te) =>
      te.centerAlignColumn(),
    );
    this.drawBtn(rowOneBtns, 'alignRight', 'right align column', (te) =>
      te.rightAlignColumn(),
    );

    const rowTwoBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowTwoBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText("Move:");
    this.drawBtn(rowTwoBtns, 'moveRowDown', 'move row down', (te) =>
      te.moveRowDown(),
    );
    this.drawBtn(rowTwoBtns, 'moveRowUp', 'move row up', (te) =>
      te.moveRowUp(),
    );
    this.drawBtn(rowTwoBtns, 'moveColumnRight', 'move column right', (te) =>
      te.moveColumnRight(),
    );
    this.drawBtn(rowTwoBtns, 'moveColumnLeft', 'move column left', (te) =>
      te.moveColumnLeft(),
    );

    const rowThreeBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowThreeBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText("Edit:");
    this.drawBtn(rowThreeBtns, 'insertRow', 'insert row above', (te) =>
      te.insertRow(),
    );
    this.drawBtn(rowThreeBtns, 'insertColumn', 'insert column left', (te) =>
      te.insertColumn(),
    );
    this.drawBtn(rowThreeBtns, 'deleteRow', 'delete row', (te) =>
      te.deleteRow(),
    );
    this.drawBtn(rowThreeBtns, 'deleteColumn', 'delete column', (te) =>
      te.deleteColumn(),
    );

    const rowFourBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowFourBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText("Sort/F:");
    this.drawBtn(rowFourBtns, 'sortAsc', 'sort by column ascending', (te) =>
      te.sortRowsAsc(),
    );
    this.drawBtn(rowFourBtns, 'sortDesc', 'sort by column descending', (te) =>
      te.sortRowsDesc(),
    );
    this.drawBtn(rowFourBtns, 'formula', 'evaluate formulas', (te) =>
      te.evaluateFormulas(),
    );

    const rowFiveBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowFiveBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText("Misc:");
    this.drawBtn(rowFiveBtns, 'csv', 'export as csv', (te) =>
      te.exportCSVModal(),
    );
    this.drawBtn(rowFiveBtns, 'help', 'help', () =>
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
    title: string,
    fn: (te: TableEditor) => void,
  ): void => {
    const cursorCheck = (te: TableEditor): boolean => {
      if (title === 'evaluate formulas') {
        return te.cursorIsInTable() || te.cursorIsInTableFormula();
      }
      return te.cursorIsInTable();
    };

    const button = parent.createDiv({ cls: 'advanced-tables-button nav-action-button', title });
    button.onClickEvent(() => this.withTE(fn, cursorCheck));
    button.appendChild(Element(icons[iconName]));
  };

  private readonly withTE = (
    fn: (te: TableEditor) => void,
    cursorCheck: (te: TableEditor) => boolean,
    alertOnNoTable = true,
  ): void => {
    let editor: Editor;
    const leaf = this.app.workspace.getMostRecentLeaf();
    if (leaf.view instanceof MarkdownView) {
      editor = leaf.view.editor;
    } else {
      console.warn('Advanced Tables: Unable to determine current editor.');
      return;
    }

    const te = new TableEditor(this.app, leaf.view.file, editor, this.settings);
    if (!cursorCheck(te)) {
      if (alertOnNoTable) {
        new Notice('Advanced Tables: Cursor must be in a table.');
      }
      return;
    }

    fn(te);
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
