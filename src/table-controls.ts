import { TableEditor } from './table-editor';

/**
 * TableControls displays a line widget in the editor to users.
 * Buttons allow easy access to table manipulation functions.
 */
export class TableControls {
  private readonly cm: CodeMirror.Editor;
  private readonly te: TableEditor;

  /**
   * Stores the position of the cursor when this widget was created.
   */
  private readonly cursorPos: CodeMirror.Position;

  /**
   * Stores the CodeMirror widget object, which can be used to
   * remove it from the editor.
   */
  private widget: CodeMirror.LineWidget;

  constructor(cm: CodeMirror.Editor, te: TableEditor) {
    this.cm = cm;
    this.te = te;

    this.cursorPos = cm.getCursor();
  }

  /**
   * Build the line widget DOM node, and display to user.
   */
  public readonly display = (): void => {
    this.widget = this.cm.addLineWidget(
      this.cm.getCursor().line,
      this.createTableControls(),
      { coverGutter: true, handleMouseEvents: true },
    );
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

    // TODO: Do the DOM mouse listeners need to be removed?
  };

  private readonly createTableControls = (): HTMLElement => {
    const node = document.createElement('div');
    node.classList.add('widget-background');

    node.appendChild(
      this.createButton('Align Left', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.leftAlignColumn();
      }),
    );

    node.appendChild(
      this.createButton('Align Center', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.centerAlignColumn();
      }),
    );

    node.appendChild(
      this.createButton('Align Right', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.rightAlignColumn();
      }),
    );

    node.appendChild(
      this.createButton('⇇', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.moveColumnLeft();
      }),
    );

    node.appendChild(
      this.createButton('⇉', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.moveColumnRight();
      }),
    );

    node.appendChild(
      this.createButton('↥', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.moveRowUp();
      }),
    );

    node.appendChild(
      this.createButton('↧', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.moveRowDown();
      }),
    );

    node.appendChild(
      this.createButton('del col', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.deleteColumn();
      }),
    );

    node.appendChild(
      this.createButton('del row', () => {
        this.cm.setCursor(this.cursorPos);
        this.te.deleteRow();
      }),
    );

    node.appendChild(
      this.createButton('⨯', () => {
        this.cm.setCursor(this.cursorPos);
        this.clear();
      }),
    );

    return node;
  };

  private readonly createButton = (
    msg: string,
    action: () => void,
  ): HTMLElement => {
    const button = document.createElement('button');
    button.appendText(msg);
    button.onClickEvent((event: MouseEvent): void => {
      action();
      this.clear();
    });
    return button;
  };
}
