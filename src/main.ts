import { defaultSettings, TableEditorPluginSettings } from './settings';
import { TableControls } from './table-controls';
import { TableEditor } from './table-editor';
import { FormatType } from '@tgrosinger/md-advanced-tables';
import {
  addIcon,
  App,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
  WorkspaceLeaf,
} from 'obsidian';
import {
  TableControlsView,
  TableControlsViewType,
} from './table-controls-view';
import { addIcons } from './icons';

export default class TableEditorPlugin extends Plugin {
  public settings: TableEditorPluginSettings;

  // cmEditors is used during unload to remove our event handlers.
  private cmEditors: CodeMirror.Editor[];

  private tableControls: TableControls;
  private tableControlsView: TableControlsView;

  public onInit(): void {
    console.log('ON INIT');
  }

  public async onload(): Promise<void> {
    console.log('loading markdown-table-editor plugin');

    await this.loadSettings();

    this.registerView(
      TableControlsViewType,
      (leaf) =>
        (this.tableControlsView = new TableControlsView(leaf, this.settings)),
    );

    addIcons();

    if (this.settings.showRibbonIcon) {
      this.addRibbonIcon('spreadsheet', 'Advanced Tables Toolbar', () => {
        if (this.settings.experimentalToolbar) {
          this.toggleTableControlsView();
        } else {
          this.newPerformTableAction((te: TableEditor) => {
            this.tableControls = te.openTableControls(this.app);
          })();
        }
      });
    }
    if (this.settings.useMonospaceFont) {
      this.enableMonospaceFont();
    }

    this.cmEditors = [];
    this.registerCodeMirror((cm) => {
      this.cmEditors.push(cm);
      cm.on('keydown', this.handleKeyDown);
    });

    this.addCommand({
      id: 'next-row',
      name: 'Go to next row',
      callback: this.newPerformTableAction((te: TableEditor) => {
        if (this.settings.bindEnter) {
          new Notice(
            'Advanced Tables: Next row also bound to enter. ' +
              'Possibly producing double actions. See Advanced Tables settings.',
          );
        }
        te.nextRow();
      }),
    });

    this.addCommand({
      id: 'next-cell',
      name: 'Go to next cell',
      callback: this.newPerformTableAction((te: TableEditor) => {
        if (this.settings.bindEnter) {
          new Notice(
            'Advanced Tables: Next cell also bound to tab. ' +
              'Possibly producing double actions. See Advanced Tables settings.',
          );
        }
        te.nextCell();
      }),
    });

    this.addCommand({
      id: 'previous-cell',
      name: 'Go to previous cell',
      callback: this.newPerformTableAction((te: TableEditor) => {
        if (this.settings.bindEnter) {
          new Notice(
            'Advanced Tables: Previous cell also bound to shift+tab. ' +
              'Possibly producing double actions. See Advanced Tables settings.',
          );
        }
        te.previousCell();
      }),
    });

    this.addCommand({
      id: 'format-table',
      name: 'Format table at the cursor',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.formatTable();
      }),
    });

    this.addCommand({
      id: 'format-all-tables',
      name: 'Format all tables in this file',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.formatAllTables();
      }),
    });

    this.addCommand({
      id: 'insert-column',
      name: 'Insert column before current',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.insertColumn();
      }),
    });

    this.addCommand({
      id: 'insert-row',
      name: 'Insert row before current',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.insertRow();
      }),
    });

    this.addCommand({
      id: 'escape-table',
      name: 'Move cursor out of table',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.escape();
      }),
    });

    this.addCommand({
      id: 'left-align-column',
      name: 'Left align column',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.leftAlignColumn();
      }),
    });

    this.addCommand({
      id: 'center-align-column',
      name: 'Center align column',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.centerAlignColumn();
      }),
    });

    this.addCommand({
      id: 'right-align-column',
      name: 'Right align column',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.rightAlignColumn();
      }),
    });

    this.addCommand({
      id: 'move-column-left',
      name: 'Move column left',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.moveColumnLeft();
      }),
    });

    this.addCommand({
      id: 'move-column-right',
      name: 'Move column right',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.moveColumnRight();
      }),
    });

    this.addCommand({
      id: 'move-row-up',
      name: 'Move row up',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.moveRowUp();
      }),
    });

    this.addCommand({
      id: 'move-row-down',
      name: 'Move row down',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.moveRowDown();
      }),
    });

    this.addCommand({
      id: 'delete-column',
      name: 'Delete column',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.deleteColumn();
      }),
    });

    this.addCommand({
      id: 'delete-row',
      name: 'Delete row',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.deleteRow();
      }),
    });

    this.addCommand({
      id: 'sort-rows-ascending',
      name: 'Sort rows ascending',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.sortRowsAsc();
      }),
    });

    this.addCommand({
      id: 'sort-rows-descending',
      name: 'Sort rows descending',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.sortRowsDesc();
      }),
    });

    this.addCommand({
      id: 'evaluate-formulas',
      name: 'Evaluate table formulas',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.evaluateFormulas();
      }),
    });

    this.addCommand({
      id: 'table-control-bar',
      name: 'Open table controls toolbar',
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 'd',
        },
      ],
      callback: () => {
        if (this.settings.experimentalToolbar) {
          this.toggleTableControlsView();
        } else {
          this.newPerformTableAction((te: TableEditor) => {
            this.tableControls = te.openTableControls(this.app);
          })();
        }
      },
    });

    this.addSettingTab(new TableEditorSettingsTab(this.app, this));
  }

  public onunload(): void {
    console.log('unloading markdown-table-editor plugin');

    if (this.tableControls) {
      this.tableControls.clear();
      this.tableControls = null;
    }

    this.cmEditors.forEach((cm) => {
      cm.off('keydown', this.handleKeyDown);
    });
  }

  public enableMonospaceFont(): void {
    console.debug(
      'Advanced Tables: Adding css class to enable monospace font in tables',
    );

    const existingElem = document.getElementById('advanced-tables-monospace');
    if (existingElem) {
      console.debug('Advanced Tables: css already enabled, skipping');
      return;
    }

    let font = 'monospace';
    const preferredFont = this.settings.preferredMonospaceFont;
    if (preferredFont) {
      font = `${preferredFont}, ${font}`;
    }

    const css = `
<style type='text/css' id='advanced-tables-monospace'>
  .HyperMD-table-row {
    font-family: ${font} !important;
  }
</style>
`;
    document.head.insertAdjacentHTML('beforeend', css);
  }

  public disableMonospaceFont(): void {
    const elem = document.getElementById('advanced-tables-monospace');
    if (elem) {
      elem.parentElement.removeChild(elem);
    }
  }

  private readonly newPerformTableAction = (
    fn: (te: TableEditor) => void,
    alertOnNoTable = true,
  ) => (): void => {
    // Any action will trigger hiding the table controls
    if (this.tableControls) {
      this.tableControls.clear();
      this.tableControls = null;
    }

    // Any action will trigger checking for tables that need to be monospaced
    if (this.settings.useMonospaceFont) {
      this.enableMonospaceFont();
    }

    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      const te = new TableEditor(
        activeLeaf.view.sourceMode.cmEditor,
        this.settings,
      );

      if (!te.cursorIsInTable()) {
        if (alertOnNoTable) {
          new Notice('Advanced Tables: Cursor must be in a table.');
        }
        return;
      }

      fn(te);
    }
  };

  private readonly handleKeyDown = (
    cm: CodeMirror.Editor,
    event: KeyboardEvent,
  ): void => {
    if (['Tab', 'Enter'].contains(event.key)) {
      this.newPerformTableAction((te: TableEditor) => {
        switch (event.key) {
          case 'Tab':
            if (!this.settings.bindTab) {
              return;
            }

            if (event.shiftKey) {
              te.previousCell();
            } else {
              te.nextCell();
            }
            break;
          case 'Enter':
            if (!this.settings.bindEnter) {
              return;
            }

            if (event.shiftKey) {
              te.escape();
            } else if (event.ctrlKey || event.metaKey || event.altKey) {
              return;
            } else {
              te.nextRow();
            }
            break;
        }
        event.preventDefault();
      }, false)();
    }
  };

  private readonly toggleTableControlsView = () => {
    const existingView = this.app.workspace.getLeavesOfType(
      TableControlsViewType,
    );
    if (existingView.length) {
      console.log(existingView);
      this.app.workspace.detachLeavesOfType(TableControlsViewType);
      return;
    }

    const newLeaf = this.app.workspace.createLeafBySplit(
      this.app.workspace.getMostRecentLeaf(),
      'horizontal',
      true,
    );
    newLeaf.setViewState({
      type: TableControlsViewType,
      pinned: true,
      active: false,
    });

    console.log('testing');
  };

  private async loadSettings(): Promise<void> {
    const settingsOptions = Object.assign(
      defaultSettings,
      await this.loadData(),
    );
    this.settings = new TableEditorPluginSettings(settingsOptions);
    this.saveData(this.settings);
  }
}

class TableEditorSettingsTab extends PluginSettingTab {
  private readonly plugin: TableEditorPlugin;

  constructor(app: App, plugin: TableEditorPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  public display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Advanced Tables Plugin - Settings' });

    new Setting(containerEl)
      .setName('Bind enter to table navigation')
      .setDesc(
        'If enabled, when the cursor is in a table, enter advances to the next ' +
          'row. Disabling this can help avoid conflicting with tag or CJK ' +
          'autocompletion. If disabling, bind "Go to ..." in the Obsidian Hotkeys settings.',
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.bindEnter).onChange((value) => {
          this.plugin.settings.bindEnter = value;
          this.plugin.saveData(this.plugin.settings);
          this.display();
        }),
      );

    new Setting(containerEl)
      .setName('Bind tab to table navigation')
      .setDesc(
        'If enabled, when the cursor is in a table, tab/shift+tab navigate ' +
          'between cells. Disabling this can help avoid conflicting with tag ' +
          'or CJK autocompletion. If disabling, bind "Go to ..." in the Obsidian Hotkeys settings.',
      )
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.bindTab).onChange((value) => {
          this.plugin.settings.bindTab = value;
          this.plugin.saveData(this.plugin.settings);
          this.display();
        }),
      );

    new Setting(containerEl)
      .setName('Pad cell width using spaces')
      .setDesc(
        'If enabled, table cells will have spaces added to match the with of the ' +
          'longest cell in the column. Only useful when using a monospace font during editing.',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.formatType === FormatType.NORMAL)
          .onChange((value) => {
            this.plugin.settings.formatType = value
              ? FormatType.NORMAL
              : FormatType.WEAK;
            this.plugin.saveData(this.plugin.settings);
            this.display();
          }),
      );

    new Setting(containerEl)
      .setName('Show icon in sidebar')
      .setDesc(
        'If enabled, a button which opens the table controls toolbar will be added to the Obsidian sidebar. ' +
          'The toolbar can also be opened with a Hotkey. Changes only take effect on reload.',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showRibbonIcon)
          .onChange((value) => {
            this.plugin.settings.showRibbonIcon = value;
            this.plugin.saveData(this.plugin.settings);
            this.display();
          }),
      );

    new Setting(containerEl)
      .setName('Use monospace font')
      .setDesc(
        'If enabled, a monospaced font will be used for text inside tables. If you already use a monospace font while editing, disable this to preserve your preferred font.',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.useMonospaceFont)
          .onChange((value) => {
            this.plugin.settings.useMonospaceFont = value;
            this.plugin.saveData(this.plugin.settings);
            if (value) {
              this.plugin.enableMonospaceFont();
            } else {
              this.plugin.disableMonospaceFont();
            }
            this.display();
          }),
      );

    if (this.plugin.settings.useMonospaceFont) {
      new Setting(containerEl)
        .setName('Monospace Font Name')
        .setDesc(
          'Optionally, provide a preferred monospace font that is installed on this system.',
        )
        .addText((text) => {
          text.setPlaceholder('monospace');
          if (this.plugin.settings.preferredMonospaceFont) {
            text.setValue(this.plugin.settings.preferredMonospaceFont);
          }
          text.onChange((value) => {
            this.plugin.settings.preferredMonospaceFont = value;
            this.plugin.saveData(this.plugin.settings);
            this.plugin.disableMonospaceFont();
            this.plugin.enableMonospaceFont();
          });
        });
    }

    new Setting(containerEl)
      .setName('Use experimental new table toolbar')
      .setDesc(
        'The new toolbar can be toggled with the same hotkey or ribbon button',
      )
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.experimentalToolbar)
          .onChange((value) => {
            this.plugin.settings.experimentalToolbar = value;
            this.plugin.saveData(this.plugin.settings);
            this.display();
          }),
      );

    const div = containerEl.createEl('div', {
      cls: 'advanced-tables-donation',
    });

    const donateText = document.createElement('p');
    donateText.appendText(
      'If this plugin adds value for you and you would like to help support ' +
        'continued development, please use the buttons below:',
    );
    div.appendChild(donateText);

    div.appendChild(
      createDonateButton(
        'https://www.buymeacoffee.com/tgrosinger',
        'Buy Me a Coffee',
        'https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png',
      ),
    );

    div.appendChild(
      createDonateButton(
        'https://paypal.me/tgrosinger',
        'PayPal.Me',
        'https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_150x38.png',
      ),
    );
  }
}

const createDonateButton = (
  link: string,
  name: string,
  imgURL: string,
): HTMLElement => {
  const a = document.createElement('a');
  a.setAttribute('href', link);
  a.addClass('advanced-tables-donate-button');

  const img = document.createElement('img');
  img.setAttribute('width', '150px');
  img.setAttribute('src', imgURL);
  img.setText(name);

  a.appendChild(img);
  return a;
};
