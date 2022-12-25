(function () {
  window.addEventListener('load', () => {
    init();
  });

  const H3 = 'h3';
  const DIV = 'div';
  const UL = 'ul';
  const LI = 'li';
  const GLASS_FISH_HEADER = "glassFishHeader";
  const GLASS_FISH_CONTENT = "glassFishContent";
  const COMPONENTS_HEADER = 'componentsHeader';
  const COMPONENTS_PS_ALL_HEADER = 'componentsPsAllHeader';

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
    document.body.append(createElement(H3, i18n(COMPONENTS_HEADER)));
    let componentsUlElement = createElement(UL);
    document.body.append(componentsUlElement);
    withOutGlassfish.forEach(component => {
      return componentsUlElement.append(createElement(LI, component));
    });
    document.body.append(createElement(H3, i18n(COMPONENTS_PS_ALL_HEADER)));
    document.body.append(
      createConsoleCommand(`slkz ps | ergep (${withOutGlassfish.join('|')})`));
  }

  function createElement(tag, text) {
    let element = document.createElement(tag);
    if (text) {
      element.textContent = text;
    }
    return element;
  }

  function createConsoleCommand(command) {
    let consoleElement = createElement(DIV);
    consoleElement.className = 'console';
    consoleElement.textContent = `$> ${command}`;
    return consoleElement;
  }

  function i18n(message) {
    return chrome.i18n.getMessage(message);
  }
})()
