import {
  FormatType,
  Options,
  optionsWithDefaults,
} from '@tgrosinger/md-advanced-tables';

export class TableEditorPluginSettings {
  public formatType: FormatType;
  public showRibbonIcon: boolean;
  public useMonospaceFont: boolean;
  public preferredMonospaceFont: string;

  constructor() {
    this.formatType = FormatType.NORMAL;
    this.showRibbonIcon = true;
    this.useMonospaceFont = true;
  }

  public asOptions(): Options {
    return optionsWithDefaults({ formatType: this.formatType });
  }
}
