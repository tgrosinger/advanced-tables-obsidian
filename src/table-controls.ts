import { icons } from './icons';
import { TableEditor } from './table-editor';
import { App } from 'obsidian';

/**
 * TableControls displays a line widget in the editor to users.
 * Buttons allow easy access to table manipulation functions.
 */
export class TableControls {
  private readonly cm: CodeMirror.Editor;
  private readonly te: TableEditor;
  private readonly app: App;

  /**
   * Stores the CodeMirror widget object, which can be used to
   * remove it from the editor.
   */
  private widget: CodeMirror.LineWidget;

  constructor(cm: CodeMirror.Editor, te: TableEditor, app: App) {
    this.cm = cm;
    this.te = te;
    this.app = app;
  }

  /**
   * Build the line widget DOM node, and display to user.
   */
  public readonly display = (): void => {
    this.widget = this.cm.addLineWidget(
      this.cm.getCursor().line,
      this.createTableControls(),
      {
        coverGutter: true,
        handleMouseEvents: false, // Editor does not handle mouse events, browser does
        noHScroll: true, // Don't move the toolbar if editor is horiz. scrolled
      },
    );

    this.cm.on('keydown', this.handleEscapeKey);
  };

  /**
   * Close this line widget.
   */
  public readonly clear = (): void => {
    console.debug('Clearing table control widget...');
    if (this.widget) {
      this.widget.clear();
      this.widget = null;
      console.debug('Table control widget cleared');
    }

    this.cm.off('keydown', this.handleEscapeKey);
  };

  private readonly createTableControls = (): HTMLElement => {
    const node = document.createElement('div');
    node.classList.add('widget-background');

    node.appendChild(
      this.createButtonSvg(
        Element(icons.alignLeft),
        'Align column left',
        () => {
          this.te.leftAlignColumn();
        },
      ),
    );

    node.appendChild(
      this.createButtonSvg(
        Element(icons.alignCenter),
        'Align column center',
        () => {
          this.te.centerAlignColumn();
        },
      ),
    );

    node.appendChild(
      this.createButtonSvg(
        Element(icons.alignRight),
        'Align column right',
        () => {
          this.te.rightAlignColumn();
        },
      ),
    );

    node.appendChild(
      this.createButtonSvg(
        Element(icons.sortAsc),
        'Sort rows ascending',
        () => {
          this.te.sortRowsAsc();
        },
      ),
    );

    node.appendChild(
      this.createButtonSvg(
        Element(icons.sortDesc),
        'Sort rows descending',
        () => {
          this.te.sortRowsDesc();
        },
      ),
    );

    node.appendChild(
      this.createButtonSvg(
        Element(icons.moveColumnLeft),
        'Move column left',
        () => {
          this.te.moveColumnLeft();
        },
      ),
    );

    node.appendChild(
      this.createButtonSvg(
        Element(icons.moveColumnRight),
        'Move column right',
        () => {
          this.te.moveColumnRight();
        },
      ),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.moveRowUp), 'Move row up', () => {
        this.te.moveRowUp();
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.moveRowDown), 'Move row down', () => {
        this.te.moveRowDown();
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.insertColumn), 'Insert column', () => {
        this.te.insertColumn();
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.insertRow), 'Insert row', () => {
        this.te.insertRow();
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.deleteColumn), 'Delete column', () => {
        this.te.deleteColumn();
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.deleteRow), 'Delete row', () => {
        this.te.deleteRow();
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.formula), 'Evaluate formulas', () => {
        this.te.evaluateFormulas();
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.help), 'Help', () => {
        window.open(
          'https://github.com/tgrosinger/advanced-tables-obsidian/blob/main/docs/help.md',
        );
      }),
    );

    node.appendChild(
      this.createButtonSvg(Element(icons.close), 'Close toolbar', () => {
        this.clear();
      }),
    );

    return node;
  };

  private readonly createButtonSvg = (
    icon: HTMLElement,
    title: string,
    action: () => void,
  ): HTMLElement => {
    const button = document.createElement('button');
    button.addClass('widget-button');
    if (title === 'Close toolbar') {
      button.addClass('widget-button-close');
    }
    button.setAttribute('title', title);
    button.appendChild(icon);
    button.onClickEvent((event: MouseEvent): void => {
      action();
      this.clear();
    });
    return button;
  };

  private readonly handleEscapeKey = (
    cm: CodeMirror.Editor,
    event: KeyboardEvent,
  ): void => {
    if (event.key === 'Escape') {
      this.clear();
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
