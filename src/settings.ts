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

  public bindEnter: boolean;
  public bindTab: boolean;

  constructor() {
    this.formatType = FormatType.NORMAL;
    this.showRibbonIcon = true;
    this.useMonospaceFont = true;
    this.bindEnter = true;
    this.bindTab = true;
  }

  public asOptions(): Options {
    return optionsWithDefaults({ formatType: this.formatType });
  }
}
