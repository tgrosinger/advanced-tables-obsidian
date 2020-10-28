import { Point, TableEditor } from '@susisu/mte-kernel';
import { App, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class MyPlugin extends Plugin {
	onInit() {

	}

	onload() {
		console.log('loading plugin');

		this.addRibbonIcon('dice', 'Sample Plugin', () => {
			new Notice('This is a notice, brah!');
		});

		this.addStatusBarItem().setText('Status Bar Text');

		this.addCommand({
			id: 'open-sample-modal',
			name: 'Open Sample Modal',
			// callback: () => {
			// 	console.log('Simple Callback');
			// },
			checkCallback: (checking: boolean) => {
				let leaf = this.app.workspace.activeLeaf;
				if (leaf) {
					if (!checking) {
						new SampleModal(this.app).open();
					}
					return true;
				}
				return false;
			}
		});

		this.addCommand({
			id: 'open-selected-text-modal',
			name: 'Open Selected Text Modal',
			hotkeys: [
				{
					modifiers: ["Mod", "Shift"],
					key: "g",
				},
			],
			callback: () => {
				this.testing();
			},
		});

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		console.log('unloading plugin');
	}

	testing = () => {
		let activeLeaf = this.app.workspace.activeLeaf;
		if (activeLeaf.view instanceof MarkdownView) {
			let ote = new ObsidianTextEditor(activeLeaf.view);

			/*
			let te = new TableEditor(ote);
			let inTable = te.cursorIsInTable();
			new Notice(`Cursor in table? ${inTable}`);
			*/

			let p = ote.getCursorPosition();
			new Notice(`Cursor: row ${p.row} col ${p.column}`);
		}
	}
}

class ObsidianTextEditor {
	view: MarkdownView;

	constructor(view: MarkdownView) {
		this.view = view;
	}

	getCursorPosition = (): Point => {
		let editor = this.view.sourceMode.cmEditor;
		 let position = editor.getCursor();
		 return new Point(position.line, position.ch);
	}

	setCursorPosition = (pos: Point): void => {

	};

	setSelectionRange = (range: Range): void => {

	};

	getLastRow = (): number => {

	};

	acceptsTableEdit = (row: number): boolean => {

	};

	getLine = (row: number): string => {

	};

	insertLine = (row: number, line: string): void  => {

	};

	deleteLine = (row: number): void => {

	};

	replaceLines = (startRow: number, endRow: number, lines: Array<string>): void => {

	};  

	transact = (func: Function): void => {

	};
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.setText('Woah! A modal :-)');
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings for my awesome plugin.'});

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text.setPlaceholder('Enter your secret')
				.setValue('')
				.onChange((value) => {
					console.log('Secret: ' + value);
				}));

	}
}
