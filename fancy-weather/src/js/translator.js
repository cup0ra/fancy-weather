/* eslint-disable no-param-reassign */
const ru = require("../i18n/ru.json");
const en = require("../i18n/en.json");
const be = require("../i18n/be.json");

class Translator {
  constructor(language) {
    this.lang = language;
    this.elements = document.querySelectorAll ("[data-i18n]");
}

load () { 
  let translation = '';
  if(this.lang === 'ru'){
translation = ru;
    this.translate(translation);
  }
  if(this.lang === 'en'){
    translation = en;
    this.translate(translation);
  }
  if(this.lang === 'be'){
    translation = be;
    this.translate(translation);
  }
}

translate (translation) { 
  this.elements.forEach ((element) => { 
    const keys = element.dataset.i18n.split();
    const text = keys.reduce((obj, i) => obj[i], translation);
if (text) {
  element.innerHTML = text;
}
  }); 
  document.getElementById('search').placeholder = `${translation.placeholder}`
  
}
}
export default Translator;
