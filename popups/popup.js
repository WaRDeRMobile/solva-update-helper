'use strict';
(function () {
  window.addEventListener('load', async () => {
    try {
      components = await fetchComponents();
      if (!components || components.length === 0) {
        renderEmptyPage();
      }
      init();
    } catch (err) {
      console.log(err);
      renderEmptyPage();
    }
  });

  async function fetchComponents() {
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {command: FETCH_COMPONENTS});
    return response?.components;
  }

  let glassFish = 'GlassFish';
  let ignoredComponents = ['config-pusher', 'wordpress'];
  let components = [];

  // constants
  const H3 = 'h3';
  const DIV = 'div';
  const SPAN = 'span';
  const UL = 'ul';
  const LI = 'li';
  const PS1 = '$> ';
  const CLIPBOARD_COPIED_TEXT = '📋';
  // i18n
  const GLASS_FISH_HEADER = "glassFishHeader";
  const GLASS_FISH_CONTENT = "glassFishContent";
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

  function init() {
    createGlassFishContent(components);
    createComponentsContent(components);
  }

  function createGlassFishContent(components) {
    components.filter(c => c === glassFish)
      .forEach(() => {
        document.body.append(createElement(H3, i18n(GLASS_FISH_HEADER)));
        document.body.append(createElement(DIV, i18n(GLASS_FISH_CONTENT)));
      });
  }

  function createComponentsContent(components) {
    const ignored = ignoredComponents.push(glassFish);
    const deployedComponents = components.filter(it => !ignoredComponents.includes(it));
    if (!deployedComponents.length) {
      return;
    }
    renderListComponents(deployedComponents);
    renderDeployedComponents(deployedComponents);
    renderUpCommandComponents(deployedComponents);
    renderKilCommandComponents(deployedComponents);
  }

  function renderEmptyPage() {
    document.body.append(createElement(H3, i18n(EMPTY_HEADER)));
    document.body.append(createElement(DIV, i18n(EMPTY_CONTENT)));
  }

  function renderListComponents(components) {
    document.body.append(createElement(H3, i18n(COMPONENTS_HEADER)));
    let componentsUlElement = createElement(UL);
    document.body.append(componentsUlElement);
    components.forEach(component => {
      return componentsUlElement.append(createElement(LI, component));
    });
  }

  function renderDeployedComponents(components) {
    document.body.append(createElement(H3, i18n(COMPONENTS_PS_HEADER)));
    document.body.append(
      createConsoleCommand(`slkz ps | egrep (${components.join('|')})`));
    components.forEach(c => {
      document.body.append(
        createConsoleCommand(`slkz ps | grep ${c}`));
    })
  }

  function renderUpCommandComponents(components) {
    document.body.append(createElement(H3, i18n(COMPONENTS_UP_HEADER)));
    document.body.append(
      createConsoleCommand(`slkz up ${components.join(', ')}`));
    components.forEach(c => {
      document.body.append(
        createConsoleCommand(`slkz up ${c}`));
    })
  }

  function renderKilCommandComponents(components) {
    document.body.append(createElement(H3, i18n(COMPONENTS_KILL_HEADER)));
    components.forEach(c => {
      document.body.append(
        createConsoleCommand(`slkz kill ${c}`));
    })
  }

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

  function createConsoleCommand(command) {
    let consoleElement = createElement(DIV, PS1, CONSOLE_CLASS);
    let consoleCommandElement = createElement(SPAN, command);
    consoleCommandElement.onclick = consoleCommandOnClickEvent;
    consoleElement.append(consoleCommandElement);
    return consoleElement;
  }

  async function consoleCommandOnClickEvent(event) {
    let element = event.target;
    let parent = element.parentNode;
    let copy = createElement(DIV, CLIPBOARD_COPIED_TEXT, COPY_CLASS);
    parent.append(copy);
    navigator.clipboard.writeText(element.textContent)
      .then(() => {
        setTimeout(() => copy.remove(), 1000);
      });
  }

  function i18n(message) {
    return chrome.i18n.getMessage(message);
  }
})()
