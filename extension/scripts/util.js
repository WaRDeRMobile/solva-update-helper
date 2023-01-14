'use strict';

// constants
const H3 = 'h3';
const DIV = 'div';
const SPAN = 'span';
const UL = 'ul';
const LI = 'li';
const CLIPBOARD_COPIED_TEXT = '📋';
const LOCAL_STORAGE_KEY = 'solvaUpdateHelper';
// i18n
const GLASS_FISH_HEADER = 'glassFishHeader';
const GLASS_FISH_CONTENT = 'glassFishContent';
const COMPONENTS_HEADER = 'componentsHeader';
const COMPONENTS_PS_HEADER = 'componentsPsHeader';
const COMPONENTS_UP_HEADER = 'componentsUpHeader';
const COMPONENTS_KILL_HEADER = 'componentsKillHeader';
const EMPTY_HEADER = 'emptyHeader';
const EMPTY_CONTENT = 'emptyContent';
// classes
const COPY_CLASS = 'copy';
const CONSOLE_CLASS = 'console';
// commands
const FETCH_COMPONENTS = 'fetchComponents';
// defaults
const optionsGfField = 'optionsGf';
const optionsIgnoredField = 'optionsIgnored';
const optionsPs1Field = 'optionsPs1';
const defaults = {};
defaults[optionsGfField] = 'GlassFish';
defaults[optionsIgnoredField] = 'config-pusher, wordpress';
defaults[optionsPs1Field] = '$> ';

function createElement(tag, text, clazz) {
  let element = document.createElement(tag);
  if (text) {
    element.textContent = text;
  }
  if (clazz) {
    element.className = clazz;
  }
  return element;
}

function i18n(message) {
  return chrome.i18n.getMessage(message);
}

async function sendToContent(command) {
  const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
  return await chrome.tabs.sendMessage(tab.id, {command: command});
}

function translatePage() {
  document.querySelectorAll('.i18n')
    .forEach(it => {
      it.textContent = i18n(it.id);
    });
}

async function fetchParams() {
  const paramsFromStorage = await fetchFromStorage();
  return {
    ...defaults,
    ...paramsFromStorage
  };
}

async function fetchFromStorage() {
  const result = await chrome.storage.local.get([LOCAL_STORAGE_KEY]);
  return result[LOCAL_STORAGE_KEY];
}

async function persistToStorage(param) {
  const data = {};
  data[LOCAL_STORAGE_KEY] = param;
  await chrome.storage.local.set(data);
}

async function resetStorage() {
  await chrome.storage.local.clear();
}
