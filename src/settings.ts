import {
  FormatType,
  Options,
  optionsWithDefaults,
} from '@tgrosinger/md-advanced-tables';

export class TableEditorPluginSettings {
  public formatType: FormatType;

  constructor() {
    this.formatType = FormatType.NORMAL;
  }

  public asOptions(): Options {
    return optionsWithDefaults({ formatType: this.formatType });
  }
}
