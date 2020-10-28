declare module '@susisu/mte-kernel' {
  /**
   * Represents a point
   */
  export class Point {
    column: number;
    row: number;

    constructor(row: number, column: number);
    equals(point: Point): boolean;
  }

  /**
   * Represents a range in the text editor.
   */
  export class Range {
    start: Point;
    end: Point;

    constructor(start: Point, end: Point);
  }

  /**
   * An object containing options for computing text widths.
   */
  export interface TextWidthOptions {
    /**
     * Normalizes text before computing text widths.
     * @public
     */
    normalize: boolean;

    /**
     * A set of characters that should be treated as wide.
     * @public
     */
    wideChars: Set<string>;

    /**
     * A set of characters that should be treated as narrow.
     * @public
     */
    narrowChars: Set<string>;

    /**
     * Treats East Asian Ambiguous characters as wide.
     * @public
     */
    ambiguousAsWide: boolean;
  }

  /**
   * An object containing options.
   */
  export class Options {
    /**
     * A set of additional left margin characters
     * @public
     */
    leftMarginChars: Set<string>;

    /**
     * Format type, normal or weak.
     * @public
     */
    formatType: FormatType;

    /**
     * Minimum width of delimiters.
     * @public
     */
    minDelimiterWidth: number;

    /**
     * Default alignment of columns.
     * @public
     */
    defaultAlignment: DefaultAlignment;

    /**
     * Alignment of header cells.
     * @public
     */
    headerAlignment: HeaderAlignment;

    /**
     * Contains options for computing text widths.
     * @public
     */
    textWidthOptions: TextWidthOptions;

    /**
     * Enables "Smart Cursor" feature.
     * @public
     */
    smartCursor: boolean;
  }

  // Represents column alignment.
  enum Alignment {
    // Use default alignment.
    NONE = 'none',

    // Align left.
    LEFT = 'left',

    // Align right.
    RIGHT = 'right',

    // Align center.
    CENTER = 'center',
  }

  // Represents default column alignment.
  enum DefaultAlignment {
    // Align left.
    LEFT = 'left',

    // Align right.
    RIGHT = 'right',

    // Align center.
    CENTER = 'center',
  }

  // Represents alignment of header cells.
  enum HeaderAlignment {
    // Follow column's alignment.
    FOLLOW = 'follow',

    // Align left.
    LEFT = 'left',

    // Align right.
    RIGHT = 'right',

    // Align center.
    CENTER = 'center',
  }

  // Represents table format type.
  enum FormatType {
    // Formats table normally.
    NORMAL = 'normal',

    // Formats table weakly, rows are formatted independently to each other,
    // cell contents are just trimmed and not aligned.
    WEAK = 'weak',
  }

  export interface ITextEditor {
    // Gets the current cursor position.
    getCursorPosition(): Point;

    // Sets the cursor position to a specified one.
    setCursorPosition(pos: Point): void;

    // Sets the selection range.
    setSelectionRange(range: Range): void;

    /**
     * Gets the last row index of the text editor.
     */
    getLastRow(): number;

    // Checks if the editor accepts a table at a row to be edited.
    acceptsTableEdit(row: number): boolean;

    // Gets a line string at a row.
    getLine(row: number): string;

    // Inserts a line at a specified row.
    insertLine(row: number, line: string): void;

    // Deletes a line at the specified row.
    deleteLine(row: number): void;

    // Replace lines in a specified range.
    replaceLines(startRow: number, endRow: number, lines: string[]): void;

    // Batches multiple operations as a single undo/redo step.
    transact(func: Function): void;
  }

  export class TableEditor {
    constructor(textEditor: ITextEditor);

    // Alters the alignment of the focused column.
    alignColumn(alignment: Alignment, options: Options): undefined;

    // Checks if the cursor is in a table row.
    cursorIsInTable(options?: Options): boolean;

    // Deletes a column at the current focus.
    deleteColumn(options?: Options): undefined;

    // Deletes a row at the current focus.
    deleteRow(options?: Options): undefined;

    // Formats and escapes from the table.
    escape(options?: Options): undefined;

    // Formats the table under the cursor.
    format(options?: Options): undefined;

    // Formats all the tables in the text editor.
    formatAll(option: Options): undefined;

    // Inserts an empty column at the current focus.
    insertColumn(options?: Options): undefined;

    // Inserts an empty row at the current focus.
    insertRow(options?: Options): undefined;

    // Moves the focused column by the specified offset.
    moveColumn(offset: number, options?: Options): undefined;

    // Moves the focus to another cell.
    moveFocus(
      rowOffset: number,
      columnOffset: number,
      options?: Options,
    ): undefined;

    // Moves the focused row by the specified offset.
    moveRow(offset: number, options?: Options): undefined;

    // Moves the focus to the next cell.
    nextCell(option: Options): undefined;

    // Moves the focus to the next row.
    nextRow(option: Options): undefined;

    // Moves the focus to the previous cell.
    previousCell(option: Options): undefined;

    // Resets the smart cursor.
    resetSmartCursor(): undefined;

    // Selects the focused cell content.
    selectCell(options?: Options): undefined;
  }
}
