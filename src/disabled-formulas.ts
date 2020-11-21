import { App, Modal } from 'obsidian';

export class DisabledFormulasModal extends Modal {
  constructor(app: App) {
    super(app);
  }

  onOpen() {
    let { contentEl } = this;
    const header = document.createElement('h2');
    header.appendText('Table formulas temporarily disabled');
    contentEl.appendChild(header);

    const body = document.createElement('p');
    body.appendText(
      'I have discovered changes which will dramatically simplify how formulas ' +
        'function, but implementing them will take some time. In the mean time, ' +
        'I am disabling functions to prevent people from writing the old format. ' +
        'Sorry for the inconvenience!',
    );
    contentEl.appendChild(body);

    const end = document.createElement('p');
    end.appendText(
      'I look forward to showing you the new, simplified format 🙂',
    );
    contentEl.appendChild(end);
  }

  onClose() {
    let { contentEl } = this;
    contentEl.empty();
  }
}
