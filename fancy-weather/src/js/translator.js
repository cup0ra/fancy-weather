const ru = require("../lang/ru.json");
const en = require("../lang/en.json");
const be = require("../lang/be.json");

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
}
}
export default Translator;
