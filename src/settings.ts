import {
  FormatType,
  Options,
  optionsWithDefaults,
} from '@tgrosinger/md-advanced-tables';

export const defaultSettings: Partial<ISettings> = {
  formatType: FormatType.NORMAL,
  showRibbonIcon: true,
  bindEnter: true,
  bindTab: true,
};

export interface ISettings {
  formatType: FormatType;
  showRibbonIcon: boolean;
  bindEnter: boolean;
  bindTab: boolean;
}

export class TableEditorPluginSettings implements ISettings {
  public formatType: FormatType;
  public showRibbonIcon: boolean;

  public bindEnter: boolean;
  public bindTab: boolean;

  constructor(loadedData: Partial<ISettings>) {
    const allFields = { ...defaultSettings, ...loadedData };
    this.formatType = allFields.formatType;
    this.showRibbonIcon = allFields.showRibbonIcon;
    this.bindEnter = allFields.bindEnter;
    this.bindTab = allFields.bindTab;
  }

  public asOptions(): Options {
    return optionsWithDefaults({ formatType: this.formatType });
  }
}
