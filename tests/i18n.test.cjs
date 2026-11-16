const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const ts = require('typescript');

function load(file, obsidian, storage) {
  const source = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => {
      assert.equal(name, 'obsidian');
      return obsidian;
    },
    ...(storage === undefined ? {} : { localStorage: storage }),
  });
  return exports;
}

function momentMustNotBeRead() {
  throw new Error('Date locale must never select UI translations');
}

for (const [language, expected] of [
  ['en', 'Advanced Tables Toolbar'], ['en-US', 'Advanced Tables Toolbar'],
  ['zh', 'Advanced Tables 工具栏'], ['ZH_CN', 'Advanced Tables 工具栏'],
  ['zh-TW', 'Advanced Tables 工具栏'], ['fr', 'Advanced Tables Toolbar'],
]) {
  test(`UI API takes precedence for ${language}`, () => {
    const { t } = load('src/i18n.ts', {
      getLanguage: () => language, moment: { locale: momentMustNotBeRead },
    }, { getItem: () => { throw new Error('API should take precedence'); } });
    assert.equal(t('toolbar'), expected);
  });
  test(`old app uses stored UI language ${language}`, () => {
    const { t } = load('src/i18n.ts', { moment: { locale: momentMustNotBeRead } }, {
      getItem: (key) => { assert.equal(key, 'language'); return language; },
    });
    assert.equal(t('toolbar'), expected);
  });
}

for (const [name, storage] of [
  ['missing', undefined], ['empty', { getItem: () => null }],
  ['unavailable', { getItem: () => { throw new Error('Storage denied'); } }],
]) {
  test(`old app defaults to English with ${name} storage`, () => {
    const { t } = load('src/i18n.ts', { moment: { locale: momentMustNotBeRead } }, storage);
    assert.equal(t('toolbar'), 'Advanced Tables Toolbar');
  });
}

test('formula action accepts a formula cursor after language changes; ordinary actions reject it', () => {
  let language = 'en';
  const obsidian = { getLanguage: () => language, ItemView: class {} };
  const { t } = load('src/i18n.ts', obsidian);
  const source = fs.readFileSync(path.join(__dirname, '..', 'src/table-controls-view.ts'), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 },
  });
  const exports = {};
  vm.runInNewContext(outputText, {
    exports,
    require: (name) => {
      if (name === 'obsidian') return obsidian;
      if (name === './i18n') return { t };
      if (name === './icons') return { icons: { formula: '<svg/>', sortAsc: '<svg/>' } };
      if (name === './table-editor') return { TableEditor: class {} };
      throw new Error(`Unexpected runtime import: ${name}`);
    },
    DOMParser: class { parseFromString() { return { documentElement: {} }; } },
  });
  const view = new exports.TableControlsView({}, {});
  const clicks = [];
  const titles = [];
  const parent = { createDiv: ({ title }) => {
    titles.push(title);
    return { onClickEvent: (fn) => clicks.push(fn), appendChild: () => {} };
  } };
  const te = { cursorIsInTable: () => false, cursorIsInTableFormula: () => true };
  view.withTE = (action, cursorCheck) => { if (cursorCheck(te)) action(te); };
  let formulas = 0;
  let sorts = 0;
  view.drawBtn(parent, 'formula', t('formulaTooltip'), () => formulas++);
  view.drawBtn(parent, 'sortAsc', t('sortAscTooltip'), () => sorts++);
  language = 'zh';
  assert.notEqual(titles[0], t('formulaTooltip'));
  clicks.forEach((click) => click());
  assert.equal(formulas, 1);
  assert.equal(sorts, 0);
});

test('settings retain restart, navigation, conflict and reload guidance in both languages', () => {
  const english = load('src/i18n.ts', { getLanguage: () => 'en' }).t;
  const chinese = load('src/i18n.ts', { getLanguage: () => 'zh' }).t;
  for (const t of [english, chinese]) {
    for (const key of ['bindEnterDesc', 'bindTabDesc']) {
      assert.match(t(key), /restart|重启/);
      assert.match(t(key), /CJK/);
      assert.match(t(key), /tag|标签/);
      assert.match(t(key), /Hotkeys|快捷键/);
    }
    assert.match(t('bindTabDesc'), /shift\+tab/i);
    assert.match(t('showRibbonDesc'), /reload|重新加载/);
    assert.match(t('showRibbonDesc'), /Hotkey|快捷键/);
  }
});
