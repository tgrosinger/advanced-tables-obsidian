import {
  DefaultAlignment,
  FormatType,
  HeaderAlignment,
  Options,
} from '@susisu/mte-kernel';

const DEFAULT_TEXT_WIDTH_OPTIONS = {
  normalize: true,
  wideChars: new Set<string>(),
  narrowChars: new Set<string>(),
  ambiguousAsWide: false,
};

const DEFAULT_OPTIONS = {
  leftMarginChars: new Set<string>(),
  formatType: FormatType.NORMAL,
  minDelimiterWidth: 3,
  defaultAlignment: DefaultAlignment.LEFT,
  headerAlignment: HeaderAlignment.FOLLOW,
  smartCursor: false,
};

export const optionsWithDefaults = (options: Partial<Options>): Options => {
  return {
    ...DEFAULT_OPTIONS,
    ...options,
    textWidthOptions: options.textWidthOptions
      ? { ...DEFAULT_TEXT_WIDTH_OPTIONS, ...options.textWidthOptions }
      : DEFAULT_TEXT_WIDTH_OPTIONS,
  };
};

export const defaultOptions: Options = optionsWithDefaults({});
