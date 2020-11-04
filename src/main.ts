import { TableEditorPluginSettings } from './settings';
import { TableControls } from './table-controls';
import { TableEditor } from './table-editor';
import { FormatType } from '@tgrosinger/md-advanced-tables';
import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

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
      id: 'format-table',
      name: 'Format table at the cursor',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.formatTable();
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
      id: 'table-control-bar',
      name: 'Open table controls toolbar',
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 'd',
        },
      ],
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.openTableControls();
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

  private readonly newPerformTableAction = (
    fn: (te: TableEditor) => void,
  ) => (): void => {
    // Any action will trigger hiding the table controls
    if (this.tableControls) {
      this.tableControls.clear();
      this.tableControls = null;
    }

    const activeLeaf = this.app.workspace.activeLeaf;
    if (activeLeaf.view instanceof MarkdownView) {
      const te = new TableEditor(
        activeLeaf.view.sourceMode.cmEditor,
        this.settings,
      );

      if (!te.cursorIsInTable()) {
        // TODO: Show modal if not in table
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
            if (event.shiftKey) {
              te.previousCell();
            } else {
              te.nextCell();
            }
            break;
          case 'Enter':
            te.nextRow();
            break;
        }
        event.preventDefault();
      })();
    }
  };

  private async loadSettings(): Promise<void> {
    this.settings = new TableEditorPluginSettings();
    (async () => {
      const loadedSettings = await this.loadData();
      if (loadedSettings) {
        console.log('Found existing settings file');
        this.settings.formatType = loadedSettings.formatType;
      } else {
        console.log('No settings file found, saving...');
        this.saveData(this.settings);
      }
    })();
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

    containerEl.createEl('h2', { text: 'Table Plugin Editor - Settings' });

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
  }
}
