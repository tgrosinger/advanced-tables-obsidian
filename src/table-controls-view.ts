import { icons } from './icons';
import { t } from './i18n';
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
    return t('title');
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

    const rootEl = activeDocument.createElement('div');
    rootEl.addClass('advanced-tables-buttons');

    rootEl.createDiv().
      createSpan({ cls: 'title' }).
      setText(t('title'))

    const navHeader = rootEl.createDiv({ cls: 'nav-header' });
    const rowOneBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowOneBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText(t('alignLabel'));
    this.drawBtn(rowOneBtns, 'alignLeft', t('leftTooltip'), (te) =>
      te.leftAlignColumn(),
    );
    this.drawBtn(rowOneBtns, 'alignCenter', t('centerTooltip'), (te) =>
      te.centerAlignColumn(),
    );
    this.drawBtn(rowOneBtns, 'alignRight', t('rightTooltip'), (te) =>
      te.rightAlignColumn(),
    );

    const rowTwoBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowTwoBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText(t('moveLabel'));
    this.drawBtn(rowTwoBtns, 'moveRowDown', t('moveRowDownTooltip'), (te) =>
      te.moveRowDown(),
    );
    this.drawBtn(rowTwoBtns, 'moveRowUp', t('moveRowUpTooltip'), (te) =>
      te.moveRowUp(),
    );
    this.drawBtn(rowTwoBtns, 'moveColumnRight', t('moveColumnRightTooltip'), (te) =>
      te.moveColumnRight(),
    );
    this.drawBtn(rowTwoBtns, 'moveColumnLeft', t('moveColumnLeftTooltip'), (te) =>
      te.moveColumnLeft(),
    );
    this.drawBtn(rowTwoBtns, 'transpose', t('transposeTooltip'), (te) =>
      te.transpose(),
    );

    const rowThreeBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowThreeBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText(t('editLabel'));
    this.drawBtn(rowThreeBtns, 'insertRow', t('insertRowTooltip'), (te) =>
      te.insertRow(),
    );
    this.drawBtn(rowThreeBtns, 'insertColumn', t('insertColumnTooltip'), (te) =>
      te.insertColumn(),
    );
    this.drawBtn(rowThreeBtns, 'deleteRow', t('deleteRowTooltip'), (te) =>
      te.deleteRow(),
    );
    this.drawBtn(rowThreeBtns, 'deleteColumn', t('deleteColumnTooltip'), (te) =>
      te.deleteColumn(),
    );

    const rowFourBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowFourBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText(t('sortFormulaLabel'));
    this.drawBtn(rowFourBtns, 'sortAsc', t('sortAscTooltip'), (te) =>
      te.sortRowsAsc(),
    );
    this.drawBtn(rowFourBtns, 'sortDesc', t('sortDescTooltip'), (te) =>
      te.sortRowsDesc(),
    );
    this.drawBtn(rowFourBtns, 'formula', t('formulaTooltip'), (te) =>
      te.evaluateFormulas(),
    );

    const rowFiveBtns = navHeader.createDiv({ cls: 'nav-buttons-container' });
    rowFiveBtns.createSpan({ cls: 'advanced-tables-row-label' }).setText(t('miscLabel'));
    this.drawBtn(rowFiveBtns, 'csv', t('csvTooltip'), (te) =>
      te.exportCSVModal(),
    );
    this.drawBtn(rowFiveBtns, 'help', t('helpTooltip'), () =>
      activeWindow.open(
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
      if (iconName === 'formula') {
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
        new Notice(t('noTable'));
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
