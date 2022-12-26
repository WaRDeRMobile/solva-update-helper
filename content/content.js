'use strict';
(function () {
  const FETCH_COMPONENTS = 'fetchComponents';
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.command === FETCH_COMPONENTS) {
      sendResponse(fetchComponents())
    }
  });

  function fetchComponents() {
    const result = [];
    const componentCollection = document.getElementsByClassName('components');
    for (let i = 0; i < componentCollection.length; i++) {
      const names = componentCollection.item(i).textContent.split(',');
      names
        .map(it => it.trim())
        .filter(it => it !== '')
        .forEach(it => {
            if (!result.includes(it)) {
              result.push(it)
            }
          }
        );
    }

    return {
      components: result
    };
  }
}());
