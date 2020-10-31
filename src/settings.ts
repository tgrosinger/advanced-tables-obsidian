import { optionsWithDefaults } from './mte-options';
import { FormatType, Options } from '@susisu/mte-kernel';

export class TableEditorPluginSettings {
  public formatType: FormatType;

  constructor() {
    this.formatType = FormatType.NORMAL;
  }

  public asOptions(): Options {
    return optionsWithDefaults({ formatType: this.formatType });
  }
}
