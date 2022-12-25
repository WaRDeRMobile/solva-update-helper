(function () {
  window.addEventListener('load', () => {
    init();
  });
  // const
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
  // classes
  const COPY_CLASS = 'copy';
  const CONSOLE_CLASS = 'console';

  const glassFish = 'GlassFish'
  const components = ['GlassFish', 'c1', 'c2', 'c3'];

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
    const withOutGlassfish = components.filter(c => c !== glassFish);
    if (!withOutGlassfish.length) {
      return;
    }
    renderListComponents(withOutGlassfish);
    renderDeployedComponents(withOutGlassfish);
    renderUpCommandComponents(withOutGlassfish);
    renderKilCommandComponents(withOutGlassfish);
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
