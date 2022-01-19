import { Point, Range } from '@tgrosinger/md-advanced-tables';
import { App, Editor, TFile } from 'obsidian';

/**
 * ObsidianTextEditor is an implementation of the ITextEditor interface from
 * the mte-kernel library. It teaches the table editor library how to interface
 * with Obsidian.
 */
export class ObsidianTextEditor {
  private readonly app: App;
  private readonly file: TFile;
  private readonly editor: Editor;

  constructor(app: App, file: TFile, editor: Editor) {
    this.app = app;
    this.file = file;
    this.editor = editor;
  }

  public getCursorPosition = (): Point => {
    const position = this.editor.getCursor();
    console.debug(
      `getCursorPosition was called: line ${position.line}, ch ${position.ch}`,
    );
    return new Point(position.line, position.ch);
  };

  public setCursorPosition = (pos: Point): void => {
    console.debug(
      `setCursorPosition was called: line ${pos.row}, ch ${pos.column}`,
    );
    this.editor.setCursor({ line: pos.row, ch: pos.column });
  };

  public setSelectionRange = (range: Range): void => {
    console.debug('setSelectionRange was called');
    this.editor.setSelection(
      { line: range.start.row, ch: range.start.column },
      { line: range.end.row, ch: range.end.column },
    );
  };

  public getLastRow = (): number => {
    console.debug('getLastRow was called');
    return this.editor.lastLine();
  };

  public acceptsTableEdit = (row: number): boolean => {
    console.debug(`acceptsTableEdit was called on row ${row}`);

    const cache = this.app.metadataCache.getFileCache(this.file);
    if (!cache.sections) {
      return true;
    }

    const table = cache.sections.find(
      (section): boolean =>
        section.position.start.line <= row &&
        section.position.end.line >= row &&
        section.type === 'table',
    );
    if (table === undefined) {
      console.debug('acceptsTableEdit returning false, table not found');
      return false;
    }

    // Check that the text `-tx-` is not on the line immediately preceeding the
    // table found in the previous check.
    // https://github.com/tgrosinger/advanced-tables-obsidian/issues/133
    const preceedingLineNum = table.position.start.line - 1;
    if (preceedingLineNum >= 0) {
      const preceedingLine = this.getLine(preceedingLineNum);
      if (preceedingLine === '-tx-') {
        return false;
      }
    }

    return true;
  };

  public getLine = (row: number): string => {
    console.debug(`getLine was called on line ${row}`);
    return this.editor.getLine(row);
  };

  public insertLine = (row: number, line: string): void => {
    console.debug(`insertLine was called at line ${row}`);
    console.debug(`New line: ${line}`);

    if (row > this.getLastRow()) {
      this.editor.replaceRange('\n' + line, { line: row, ch: 0 });
    } else {
      this.editor.replaceRange(line + '\n', { line: row, ch: 0 });
    }
  };

  public deleteLine = (row: number): void => {
    console.debug(`deleteLine was called on line ${row}`);

    // If on the last line of the file, we cannot replace to the next row.
    // Instead, replace all the contents of this line.
    if (row === this.getLastRow()) {
      const rowContents = this.getLine(row);
      this.editor.replaceRange(
        '',
        { line: row, ch: 0 },
        { line: row, ch: rowContents.length },
      );
    } else {
      this.editor.replaceRange(
        '',
        { line: row, ch: 0 },
        { line: row + 1, ch: 0 },
      );
    }
  };

  public replaceLines = (
    startRow: number,
    endRow: number,
    lines: string[],
  ): void => {
    // Take one off the endRow and instead go to the end of that line
    const realEndRow = endRow - 1;
    const endRowContents = this.editor.getLine(realEndRow);
    const endRowFinalIndex = endRowContents.length;

    this.editor.replaceRange(
      lines.join('\n'),
      { line: startRow, ch: 0 },
      { line: realEndRow, ch: endRowFinalIndex },
    );
  };

  public transact = (func: Function): void => {
    /*
    this.editor.operation(() => {
      func();
    });
    */
    func();
  };
}
