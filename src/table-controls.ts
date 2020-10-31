export class TableControls {
  private cm: CodeMirror.Editor;
  private widget: CodeMirror.LineWidget;

  constructor(cm: CodeMirror.Editor) {
    this.cm = cm;
  }

  public readonly display = (): void => {
    this.widget = this.cm.addLineWidget(
      this.cm.getCursor().line,
      this.createTableControls(),
      { coverGutter: true, handleMouseEvents: true },
    );

    // TODO: Register listeners for keyHandled and mouse
    // hide self if action detected.
  };

  public readonly clear = (): void => {
    console.debug('Clearing table control widget...');
    if (this.widget) {
      this.widget.clear();
      this.widget = null;
      console.debug('Table controle widget cleared');
    }

    // TODO: Unregister listeners
  };

  private readonly createTableControls = (): HTMLElement => {
    const node = document.createElement('div');
    node.classList.add('widget-background');
    node.appendText('This is a test');

    return node;
  };
}
