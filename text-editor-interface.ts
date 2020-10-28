import { Point, Range } from '@susisu/mte-kernel';
import { MarkdownView } from 'obsidian';

export class ObsidianTextEditor {
  private readonly view: MarkdownView;

  constructor(view: MarkdownView) {
    console.log('constructor called');
    this.view = view;
  }

  public getCursorPosition = (): Point => {
    console.log('getCursorPosition was called');
    const editor = this.view.sourceMode.cmEditor;
    const position = editor.getCursor();
    return new Point(position.line, position.ch);
  };

  public setCursorPosition = (pos: Point): void => {
    console.log('setCursorPosition was called');
    const editor = this.view.sourceMode.cmEditor;
    editor.setCursor({ line: pos.row, ch: pos.column });
  };

  public setSelectionRange = (range: Range): void => {
    console.log('setSelectionRange was called');
    const editor = this.view.sourceMode.cmEditor;
    editor.setSelection(
      { line: range.start.row, ch: range.start.column },
      { line: range.end.row, ch: range.end.column },
    );
  };

  public getLastRow = (): number => {
    console.log('getLastRow was called');
    const editor = this.view.sourceMode.cmEditor;
    return editor.lastLine();
  };

  public acceptsTableEdit = (row: number): boolean => {
    console.log(`acceptsTableEdit was called on row ${row}`);
    // TODO: What does this function want?
    return true;
  };

  public getLine = (row: number): string => {
    console.log(`getLine was called on line ${row}`);
    const editor = this.view.sourceMode.cmEditor;
    return editor.getLine(row);
  };

  public insertLine = (row: number, line: string): void => {
    console.log(`insertLine was called at line ${row}`);
    console.log(`New line: ${line}`);
    const editor = this.view.sourceMode.cmEditor;

    if (row > this.getLastRow()) {
      editor.replaceRange('\n' + line, { line: row, ch: 0 });
    } else {
      editor.replaceRange(line + '\n', { line: row, ch: 0 });
    }
  };

  public deleteLine = (row: number): void => {
    console.log(`deleteLine was called on line ${row}`);
    const editor = this.view.sourceMode.cmEditor;
    editor.replaceRange('', { line: row, ch: 0 }, { line: row + 1, ch: 0 });
  };

  public replaceLines = (
    startRow: number,
    endRow: number,
    lines: string[],
  ): void => {
    console.log('replaceLines was called');
    console.log(`start ${startRow}, end: ${endRow}`);
    console.log(lines);
    const editor = this.view.sourceMode.cmEditor;
    editor.replaceRange(
      lines,
      { line: startRow, ch: 0 },
      { line: endRow, ch: 0 }, // TODO: This might be off by one?
    );
  };

  public transact = (func: Function): void => {
    // TODO
    console.log('transact was called');
    console.log(func);
    func();
  };
}
