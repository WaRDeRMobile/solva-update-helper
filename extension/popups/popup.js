'use strict';

(function () {

  let glassFish = '';
  let ignoredComponents = [];
  let components = [];
  let ps1 = '';

  window.onload = async () => {
    try {
      const params = await fetchParams();
      glassFish = params[optionsGfField];
      ignoredComponents = params[optionsIgnoredField]
        .split(',')
        .map(it => it.trim());
      ps1 = params[optionsPs1Field];
      components = await fetchComponents();
      if (!components || components.length === 0) {
        renderEmptyPage();
      }
      renderPage();
    } catch (err) {
      console.log(err);
      renderEmptyPage();
    }
  };

  async function fetchComponents() {
    const response = await sendToContent(FETCH_COMPONENTS);
    return response?.components;
  }

  function renderPage() {
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
      createConsoleCommand(`slkz ps | egrep '(${components.join('|')})'`));
    components.forEach(c => {
      document.body.append(
        createConsoleCommand(`slkz ps | grep ${c}`));
    });
  }

  function renderUpCommandComponents(components) {
    document.body.append(createElement(H3, i18n(COMPONENTS_UP_HEADER)));
    document.body.append(
      createConsoleCommand(`slkz up ${components.join(', ')}`));
    components.forEach(c => {
      document.body.append(
        createConsoleCommand(`slkz up ${c}`));
    });
  }

  function renderKilCommandComponents(components) {
    document.body.append(createElement(H3, i18n(COMPONENTS_KILL_HEADER)));
    components.forEach(c => {
      document.body.append(
        createConsoleCommand(`slkz kill ${c}`));
    });
  }

  function createConsoleCommand(command) {
    let consoleElement = createElement(DIV, ps1, CONSOLE_CLASS);
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
})();
