const en = {
  toolbar: 'Advanced Tables Toolbar',
  goNextRow: 'Go to next row',
  goNextCell: 'Go to next cell',
  goPreviousCell: 'Go to previous cell',
  formatTable: 'Format table at the cursor',
  formatAllTables: 'Format all tables in this file',
  insertColumn: 'Insert column before current',
  insertRow: 'Insert row before current',
  moveOut: 'Move cursor out of table',
  leftAlign: 'Left align column',
  centerAlign: 'Center align column',
  rightAlign: 'Right align column',
  moveColumnLeft: 'Move column left',
  moveColumnRight: 'Move column right',
  moveRowUp: 'Move row up',
  moveRowDown: 'Move row down',
  deleteColumn: 'Delete column',
  deleteRow: 'Delete row',
  sortAsc: 'Sort rows ascending',
  sortDesc: 'Sort rows descending',
  transpose: 'Transpose',
  evaluate: 'Evaluate table formulas',
  openToolbar: 'Open table controls toolbar',
  bindEnter: 'Bind enter to table navigation',
  bindEnterDesc: 'Requires restart of Obsidian. If enabled, when the cursor is in a table, enter advances to the next ' +
    'row. Disabling this can help avoid conflicting with tag or CJK ' +
    'autocompletion. If disabling, bind "Go to ..." in the Obsidian Hotkeys settings.',
  bindTab: 'Bind tab to table navigation',
  bindTabDesc: 'Requires restart of Obsidian. If enabled, when the cursor is in a table, tab/shift+tab navigate ' +
    'between cells. Disabling this can help avoid conflicting with tag ' +
    'or CJK autocompletion. If disabling, bind "Go to ..." in the Obsidian Hotkeys settings.',
  padCell: 'Pad cell width using spaces',
  padCellDesc: 'If enabled, table cells will have spaces added to match the width of the ' +
    'longest cell in the column.',
  showRibbon: 'Show icon in sidebar',
  showRibbonDesc: 'If enabled, a button which opens the table controls toolbar will be added to the Obsidian sidebar. ' +
    'The toolbar can also be opened with a Hotkey. Changes only take effect on reload.',
  alignLabel: 'Align:',
  moveLabel: 'Move:',
  editLabel: 'Edit:',
  sortFormulaLabel: 'Sort/F:',
  miscLabel: 'Misc:',
  title: 'Advanced Tables',
  noTable: 'Advanced Tables: Cursor must be in a table.',
  enterConflict: 'Advanced Tables: Next row also bound to enter. Possibly producing double actions. See Advanced Tables settings.',
  tabConflict: 'Advanced Tables: Next cell also bound to tab. Possibly producing double actions. See Advanced Tables settings.',
  shiftTabConflict: 'Advanced Tables: Previous cell also bound to shift+tab. Possibly producing double actions. See Advanced Tables settings.',
  includeHeaders: 'Include table headers',
  leftTooltip: 'left align column',
  centerTooltip: 'center align column',
  rightTooltip: 'right align column',
  moveRowDownTooltip: 'move row down',
  moveRowUpTooltip: 'move row up',
  moveColumnRightTooltip: 'move column right',
  moveColumnLeftTooltip: 'move column left',
  transposeTooltip: 'transpose',
  insertRowTooltip: 'insert row above',
  insertColumnTooltip: 'insert column left',
  deleteRowTooltip: 'delete row',
  deleteColumnTooltip: 'delete column',
  sortAscTooltip: 'sort by column ascending',
  sortDescTooltip: 'sort by column descending',
  formulaTooltip: 'evaluate formulas',
  csvTooltip: 'export as csv',
  helpTooltip: 'help'
} as const;

type Key = keyof typeof en;

const zh: Record<Key, string> = {
  toolbar: 'Advanced Tables 工具栏',
  goNextRow: '转到下一行',
  goNextCell: '转到下一个单元格',
  goPreviousCell: '转到上一个单元格',
  formatTable: '格式化光标处的表格',
  formatAllTables: '格式化当前文件中的所有表格',
  insertColumn: '在当前列前插入列',
  insertRow: '在当前行前插入行',
  moveOut: '将光标移出表格',
  leftAlign: '左对齐列',
  centerAlign: '居中对齐列',
  rightAlign: '右对齐列',
  moveColumnLeft: '向左移动列',
  moveColumnRight: '向右移动列',
  moveRowUp: '向上移动行',
  moveRowDown: '向下移动行',
  deleteColumn: '删除列',
  deleteRow: '删除行',
  sortAsc: '按升序排列行',
  sortDesc: '按降序排列行',
  transpose: '转置',
  evaluate: '计算表格公式',
  openToolbar: '打开表格控制工具栏',
  bindEnter: '将 Enter 绑定到表格导航',
  bindEnterDesc: '需要重启 Obsidian 后生效。启用后，当光标位于表格中时，按 Enter 会移动到下一行。禁用此项可避免与标签或中日韩文字（CJK）自动补全冲突。禁用后，请在 Obsidian 的“快捷键”设置中为“转到……”命令绑定快捷键。',
  bindTab: '将 Tab 绑定到表格导航',
  bindTabDesc: '需要重启 Obsidian 后生效。启用后，当光标位于表格中时，按 Tab/Shift+Tab 可在单元格之间向后/向前移动。禁用此项可避免与标签或中日韩文字（CJK）自动补全冲突。禁用后，请在 Obsidian 的“快捷键”设置中为“转到……”命令绑定快捷键。',
  padCell: '用空格填充单元格宽度',
  padCellDesc: '启用后，会为单元格添加空格，使其宽度与同一列中最长的单元格一致。',
  showRibbon: '在侧边栏显示图标',
  showRibbonDesc: '启用后，会在 Obsidian 侧边栏添加用于打开表格控制工具栏的按钮。也可以通过快捷键打开工具栏。更改仅在重新加载后生效。',
  alignLabel: '对齐：',
  moveLabel: '移动：',
  editLabel: '编辑：',
  sortFormulaLabel: '排序/公式：',
  miscLabel: '其他：',
  title: 'Advanced Tables',
  noTable: 'Advanced Tables：光标必须位于表格中。',
  enterConflict: 'Advanced Tables：下一行也已绑定到 Enter，可能会执行两次操作。请检查 Advanced Tables 设置。',
  tabConflict: 'Advanced Tables：下一个单元格也已绑定到 Tab，可能会执行两次操作。请检查 Advanced Tables 设置。',
  shiftTabConflict: 'Advanced Tables：上一个单元格也已绑定到 Shift+Tab，可能会执行两次操作。请检查 Advanced Tables 设置。',
  includeHeaders: '包含表头',
  leftTooltip: '左对齐列',
  centerTooltip: '居中对齐列',
  rightTooltip: '右对齐列',
  moveRowDownTooltip: '向下移动行',
  moveRowUpTooltip: '向上移动行',
  moveColumnRightTooltip: '向右移动列',
  moveColumnLeftTooltip: '向左移动列',
  transposeTooltip: '转置',
  insertRowTooltip: '在上方插入行',
  insertColumnTooltip: '在左侧插入列',
  deleteRowTooltip: '删除行',
  deleteColumnTooltip: '删除列',
  sortAscTooltip: '按列升序排序',
  sortDescTooltip: '按列降序排序',
  formulaTooltip: '计算公式',
  csvTooltip: '导出为 CSV',
  helpTooltip: '帮助'
};

const getObsidianLanguage = (): string => {
  // getLanguage() is absent in older apps and the pinned Obsidian API typings.
  const obsidian = require('obsidian') as { getLanguage?: () => string };
  const language = obsidian.getLanguage?.();
  if (language) return language;

  // Obsidian stores its UI language here; Moment's locale is for dates only.
  try {
    return typeof localStorage === 'undefined' ? 'en' : localStorage.getItem('language') || 'en';
  } catch {
    return 'en';
  }
};

const hasChineseLanguage = (): boolean => {
  const locale = getObsidianLanguage().replace('_', '-').toLowerCase();
  return locale === 'zh' || locale.startsWith('zh-');
};

export const t = (key: Key): string => (hasChineseLanguage() ? zh : en)[key];
