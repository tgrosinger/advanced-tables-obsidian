import {
  FormatType,
  Options,
  optionsWithDefaults,
} from '@tgrosinger/md-advanced-tables';

export class TableEditorPluginSettings {
  public formatType: FormatType;
  public showRibbonIcon: boolean;

  constructor() {
    this.formatType = FormatType.NORMAL;
    this.showRibbonIcon = true;
  }

  public asOptions(): Options {
    return optionsWithDefaults({ formatType: this.formatType });
  }
}
