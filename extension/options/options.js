'use strict';

(function () {
  window.onload = async () => {
    translatePage();
    await init();
  };

  async function init() {
    const params = await fetchParams();
    for (let key in params) {
      console.log(`'${key}'=${params[key]}`);
      document.getElementById(key).value = params[key];
    }
    fetchInputs()
      .forEach(el => el.oninput = saveInputs);
    reset.onclick = () => {
      resetStorage();
      location.reload();
    };
  }

  function fetchInputs() {
    return document.querySelectorAll('input');
  }

  async function saveInputs() {
    const param = {};
    fetchInputs()
      .forEach(el => param[el.id] = el.value);
    await persistToStorage(param);
  }

}());
