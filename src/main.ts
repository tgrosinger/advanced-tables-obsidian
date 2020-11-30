import { TableEditorPluginSettings } from './settings';
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
} from 'obsidian';

export default class TableEditorPlugin extends Plugin {
  public settings: TableEditorPluginSettings;

  // cmEditors is used during unload to remove our event handlers.
  private cmEditors: CodeMirror.Editor[];

  private tableControls: TableControls;

  public onInit(): void {}

  public async onload(): Promise<void> {
    console.log('loading markdown-table-editor plugin');

    this.loadSettings();

    this.cmEditors = [];
    this.registerEvent(
      this.app.on('codemirror', (cm: CodeMirror.Editor) => {
        this.cmEditors.push(cm);
        cm.on('keydown', this.handleKeyDown);
      }),
    );

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
      callback: this.newPerformTableAction((te: TableEditor) => {
        this.tableControls = te.openTableControls(this.app);
      }),
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
            } else {
              te.nextRow();
            }
            break;
        }
        event.preventDefault();
      }, false)();
    }
  };

  private async loadSettings(): Promise<void> {
    this.settings = new TableEditorPluginSettings();
    (async () => {
      const loadedSettings = await this.loadData();
      if (loadedSettings) {
        console.log('Found existing settings file');

        if ('formatType' in loadedSettings) {
          this.settings.formatType = loadedSettings.formatType;
        }

        if ('showRibbonIcon' in loadedSettings) {
          this.settings.showRibbonIcon = loadedSettings.showRibbonIcon;
        }

        if ('useMonospaceFont' in loadedSettings) {
          this.settings.useMonospaceFont = loadedSettings.useMonospaceFont;
        }

        if ('preferredMonospaceFont' in loadedSettings) {
          this.settings.preferredMonospaceFont =
            loadedSettings.preferredMonospaceFont;
        }

        if ('bindEnter' in loadedSettings) {
          this.settings.bindEnter = loadedSettings.bindEnter;
        }

        if ('bindTab' in loadedSettings) {
          this.settings.bindTab = loadedSettings.bindTab;
        }

        console.log('Saving settings to ensure consistency');
        this.saveData(this.settings);
      } else {
        console.log('No settings file found, saving...');
        this.saveData(this.settings);
      }

      this.initAfterSettings();
    })();
  }

  /**
   * This function can be used to initialize state which depends on values
   * loaded from the settings. It will not be called until loading settings is
   * complete.
   */
  private readonly initAfterSettings = (): void => {
    if (this.settings.showRibbonIcon) {
      addIcon('spreadsheet', tableControlsIcon);
      this.addRibbonIcon('spreadsheet', 'Advanced Tables Toolbar', () => {
        this.newPerformTableAction((te: TableEditor) => {
          this.tableControls = te.openTableControls(this.app);
        })();
      });
    }
    if (this.settings.useMonospaceFont) {
      this.enableMonospaceFont();
    }
  };
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

/**
 * An svg icon of a spreadsheet
 */
const tableControlsIcon = `<svg version="1.1" viewBox="0 0 482.81 482.81" xmlns="http://www.w3.org/2000/svg">
  <path fill="currentColor" d="m457.58 25.464-432.83 0.42151c-13.658 0.013314-24.758 11.115-24.757 24.757l0.031024 347.45c7.4833e-4 8.3808 4.211 15.772 10.608 20.259 3.4533 2.4499 5.0716 3.2901 8.879 3.9022 1.7033 0.37333 3.4561 0.59471 5.2692 0.59294l432.84-0.42151c1.809-1e-3 3.5618-0.21823 5.2568-0.59294h1.2174v-0.37196c10.505-2.8727 18.279-12.397 18.278-23.788l-0.031-347.43c1e-3 -13.649-11.107-24.763-24.768-24.763zm3.5453 24.763v71.344h-163.31v-74.886h159.76c1.9641 0.0014 3.5467 1.5922 3.5467 3.5425zm-1.6737 350.37h-161.6v-67.207h163.31v64.268c1e-3 1.2572-0.70549 2.321-1.7033 2.9386zm-438.21-2.5171v-64.268h76.646v67.207h-74.942c-0.99784-0.61765-1.7033-1.6814-1.7033-2.9386zm255.28-155.18v69.688h-157.42v-69.688zm0 90.913v67.207h-157.42v-67.207zm-0.031-211.83h-157.42v-74.886h157.42zm0 21.226v77.826h-157.42v-77.826zm-178.64 77.826h-76.646v-77.826h76.646zm0.03102 21.862v69.688h-76.646v-69.688zm199.95 69.268v-69.697h163.31v69.697zm-0.031-91.552v-77.826h163.31v77.826z" stroke-width="1.3725"/>
</svg>`;
