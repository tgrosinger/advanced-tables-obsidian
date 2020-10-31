import { defaultOptions, optionsWithDefaults } from './mte-options';
import { TableEditorPluginSettings } from './settings';
import { TableControls } from './table-controls';
import { TableEditor } from './table-editor';
import { FormatType, Options } from '@susisu/mte-kernel';
import { App, MarkdownView, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class TableEditorPlugin extends Plugin {
  public settings: TableEditorPluginSettings;

  // shiftPressed tracks whether a shift key is down to allow us to inverse operations.
  private shiftPressed: boolean;

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
        cm.on('keyup', this.handleKeyUp);
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
      id: 'next-cell',
      name: 'Navigate to Next Cell',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.nextCell();
      }),
    });

    this.addCommand({
      id: 'previous-cell',
      name: 'Navigate to Previous Cell',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.previousCell();
      }),
    });

    this.addCommand({
      id: 'next-row',
      name: 'Navigate to Next Row',
      callback: this.newPerformTableAction((te: TableEditor) => {
        te.nextRow();
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
      id: 'table-control-bar',
      name: 'Open table controls menu',
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
      cm.off('keyup', this.handleKeyUp);
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
    if (event.key === 'Shift') {
      console.debug('Shift is pressed');
      this.shiftPressed = true;
      return;
    }
    if (['Tab', 'Enter'].contains(event.key)) {
      this.newPerformTableAction((te: TableEditor) => {
        switch (event.key) {
          case 'Tab':
            if (this.shiftPressed) {
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

  private readonly handleKeyUp = (
    cm: CodeMirror.Editor,
    event: KeyboardEvent,
  ): void => {
    if (event.key === 'Shift') {
      console.debug('Shift is not pressed');
      this.shiftPressed = false;
      return;
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
