/* eslint-disable no-undef */
import '../css/style.css';
import '../css/style.scss'; // require
import {getLinkToImage,getWeather,getGeocode,getGeolocation} from './moduleAPI';
import Translator from './translator';
import showWeather from './showWeather'
import showTicker from './showTicker'

const moment = require('moment-timezone');

const MICROPHONE = document.querySelector('.mic')

const BODY = document.querySelector('body')
const INPUT = document.getElementById('search')
const WEATHER = document.getElementById('weather')
const COUNTRY = document.getElementById('city')
const PLAY = document.getElementById('play')
const backgroundDefault = "../img/background.jpg"
let units = (localStorage.getItem('units') === null) ? 'metric' : localStorage.getItem('units');
let language = (localStorage.getItem('language') === null) ? 'en' : localStorage.getItem('language');
let searchCity = '';
let coordinate = []
let lat = '';
let lng = '';
let isMIC = true;
let isPLAY = true;
let timeYear = '';
let timeDay = '';
let errorMessage = ''
let isCONTROL = true;
let volume = 0.5


if (localStorage.getItem('language')) {
  const savedValue = localStorage.getItem('language');
  const option = document.querySelector(`#selector > option[value="${  savedValue  }"]`);
  if (option) {
      option.selected = true;
  }
}
if (localStorage.getItem('units')) {
  const savedValue = localStorage.getItem('units');
  const option = document.querySelector(`#scale > option[value="${  savedValue  }"]`);
  if (option) {
      option.selected = true;
  }
}


BODY.addEventListener('click', () => undefined)
moment.locale(language)
  mapboxgl.accessToken = 'pk.eyJ1IjoiY3Vwb3JhIiwiYSI6ImNrYWZtMDIydzAwMGEyenNjaXA0bW5rYm4ifQ.j0iqe20xZuIiZVDuhq3IQQ';
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center:[0,0], 
  zoom: 11
});
const marker = new mapboxgl.Marker()

 function getCity(time) {
  const city = time.results[0].formatted.split(',');
  const locationCity = city.length === 1 ? city[0] : `${city[0]  },${city[city.length-1]}`
  COUNTRY.innerHTML = locationCity
}

function dateTime() { 
  const timeZone =localStorage.getItem('timeZone')
  document.getElementById('time').innerHTML = moment().tz(timeZone).format('ddd Do MMM YYYY HH:mm:ss ');
  setTimeout(function () { dateTime(); }, 1000);
}

function timeYears(){
 const num = moment().format('M') 
 if(lat > 0){
  switch(+num){
    case 12: case 1: case 2:
      timeYear = 'winter'
      break;
    case 3: case 4: case 5:
      timeYear = 'spring'
      break;
    case 6: case 7: case 8:
      timeYear = 'summer'
      break;
    default:
      timeYear = 'autumn'
  }
 }else{
  switch(+num){
    case 12: case 1: case 2:
      timeYear = 'summer'
      break;
    case 3: case 4: case 5:
      timeYear = 'autumn'
      break;
    case 6: case 7: case 8:
      timeYear = 'winter'
      break;
    default:
      timeYear = 'spring'
  }
 }

}
function timeDays(){
  const timeZone =localStorage.getItem('timeZone')
  const hour = +moment().tz(timeZone).format('H')
  if (hour>=5 && hour<12)  timeDay = 'morning'
  if (hour>=12 && hour<18) timeDay = 'day'
  if (hour>=18 && hour<24) timeDay = 'evening'
  if (hour>=0 && hour<5) timeDay = 'night'
 }


const checkImgSrc = src => {
  return  new Promise((resolve) =>{
  const img = new Image();
  img.addEventListener("load", () => resolve(img));
  img.addEventListener("error", () => resolve(backgroundDefault) );
  img.src = src;
  })
} 
 
function showError(){
  const errors = document.createElement('div');
  errors.id = 'error';
  errors.className = 'error'
  errors.innerHTML = `<p class="error-massage">${errorMessage}</p>`
  BODY.append(errors)
  setTimeout(()=>{
    BODY.lastElementChild.remove()
  },4000)
}
 
async function showBackground(){
  getLinkToImage(timeYear,timeDay).then( async (img)=>{
    await checkImgSrc(img)
    BODY.style =`background:url("${img}") center center no-repeat fixed;`
    
  }).catch((error) =>{
    console.log(error.message)
    if(error.message === 'Unexpected token R in JSON at position 0'){
     errorMessage ='api.unsplash.com limit is reached, come in an hour'
     showError()
    }
    BODY.style=`background:url("${backgroundDefault}");`
  })
}



async function  showResults() {
 await getGeolocation().then(data => {
    const geolocation = data.loc.split(',').reverse().map((item) => {
      const result = +item;
      return result;
    });
      coordinate = geolocation
    if(searchCity === ''){
      searchCity = data.city;     
    }
   getGeocode(searchCity,language).then(time => {
      lat = time.results[0].geometry.lat;
      lng = time.results[0].geometry.lng;
      localStorage.setItem('timeZone',time.results[0].annotations.timezone.name)
      timeDays()
      timeYears()
      console.log('Season:',timeYear)
      console.log('Time of day:',timeDay)
      showBackground()
      getWeather(lat,lng,language,units).then(result => {
        coordinate = [result.lon,result.lat,];
        map.flyTo({
          center: coordinate,
          speed: 1, 
          curve: 1,
          })
        marker.remove()
        marker.setLngLat(coordinate).addTo(map);
        WEATHER.innerHTML = showWeather(result)
        const translator = new Translator(language); 
        translator.load();
        showTicker(result)
        document.querySelector('.lat').innerHTML = `${time.results[0].annotations.DMS.lat.split(' ').splice(0,2).join(' ')} ${time.results[0].annotations.DMS.lat.split(' ').splice(-1).join(' ')}`
        document.querySelector('.lng').innerHTML = `${time.results[0].annotations.DMS.lng.split(' ').splice(0,2).join(' ')} ${time.results[0].annotations.DMS.lng.split(' ').splice(-1).join(' ')}`
        getCity(time)
        dateTime();
        document.querySelector('.wrapper').style.display = 'block';
        localStorage.setItem('search', searchCity);
      })
    }).catch((error) =>{
      if(error.message === "Cannot read property 'geometry' of undefined"){
        errorMessage =`no result for "${searchCity}"`
        showError()
      }
      INPUT.value = ''
      searchCity = localStorage.getItem('search')
    })
  }).catch(error => {
    if(error.message === 'Failed to fetch'){
     errorMessage = 'No internet connection'
    }  if(error.message === "Cannot read property 'geometry' of undefined"){
      errorMessage =`no result for "${searchCity}"`
    }
    else{
    errorMessage = error.message   }
    showError()
  }
  ) 
}
showResults()

function searchMovie(){
  searchCity = INPUT.value
  showResults()
}

document.addEventListener('submit',(event) => {
  event.preventDefault();
  searchMovie ()
})

document.querySelector('#scale').addEventListener('change', function() {
  units = this.value;
  showResults()
  localStorage.setItem('units',units)
})

document.querySelector('.refresh-img').addEventListener('click',() => {
  showBackground(searchCity)
})

const synth = window.speechSynthesis;
const voices = window.speechSynthesis.getVoices();

function speakWeather(){ 
  isPLAY =false
  const message = `
  ${document.querySelector('.city').innerText} 
  ${document.querySelector('.temp').innerText} 
  ${document.querySelector('.description').innerText} 
  ${document.querySelector('.feel').innerText}
  ${document.querySelector('.wind').innerText}
  ${document.querySelector('.humidity').innerText}`
if ( 'speechSynthesis' in window ) {
  const speak = new window.SpeechSynthesisUtterance(message);
  speak.lang = language
  if(speak.lang === 'be'){
    speak.lang = 'ru'
  }
  speak.volume = +volume.toFixed(1);
  console.log('volume',speak.volume.toFixed(1))
  synth.speak(speak);
  speak.addEventListener('end',() => {
    isPLAY = true
    document.querySelector('.play').classList.remove('play-active')
    document.querySelector('.img').classList.remove('img-active')
  })
}
  document.querySelector('.play').classList.add('play-active')
  document.querySelector('.img').classList.add('img-active')
}

PLAY.addEventListener('click', () =>{
  if(isPLAY === true){
    speakWeather()
  }
  
})


 
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
window.SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
window.SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
const recognition = new window.SpeechRecognition();
recognition.lang = language;
recognition.continuous = false;

MICROPHONE.addEventListener('click',() => {
  if(isMIC === true && isCONTROL === true){
    isMIC = false
    recognition.start();
    document.querySelector('.mic-img').classList.add('mic-img-active')
    MICROPHONE.classList.add('mic-active')
  }
  if(isCONTROL === false && isMIC === true){
    recognition.maxAlternatives = 10;
    isMIC = false
    document.querySelector('.mic-img').classList.add('mic-img-active')
    MICROPHONE.classList.add('mic-active')
    isMIC = false
  }
})


document.querySelector('#speak').addEventListener('click',(event) =>{
  if(isCONTROL === true && event.target.className === 'img-speak'){ 
    recognition.start();
    document.querySelector('.speak').classList.toggle('speak-active')
    document.querySelector('.speak').classList.toggle('speak')
    document.querySelector('.img-speak').classList.toggle('img-speak-active')
    document.querySelector('.img-speak').classList.toggle('img-speak')
  isCONTROL = false
  }else if(event.target.className === 'img-speak-active'){
      recognition.stop()
      isCONTROL = true
      document.querySelector('.speak-active').classList.toggle('speak')
      document.querySelector('.speak-active').classList.toggle('speak-active')
      document.querySelector('.img-speak-active').classList.toggle('img-speak')
      document.querySelector('.img-speak-active').classList.toggle('img-speak-active')
      }
})
 
recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
  if(speechToText === 'weather' || speechToText ===  'погода' ){
    recognition.maxAlternatives = 1;
    speakWeather()
   }
   if(speechToText === 'louder' || speechToText ===  'громче' ){
    recognition.maxAlternatives = 1;
    if(volume <= 1 ){
      volume += 0.1
      console.log('volume',+volume.toFixed(1))
    }
   }
   if(speechToText === 'quieter' || speechToText ===  'тише' ){
    recognition.maxAlternatives = 1;
    if( volume >= 0){
      volume -= 0.1
      console.log('volume',+volume.toFixed(1))
    }
   }
   if(isMIC === false){
    INPUT.value = speechToText;
   }
}
recognition.addEventListener('end',() => { 
  if( isMIC === false){
    searchMovie()
    isMIC = true
    document.querySelector('.mic-img').classList.remove('mic-img-active')
    MICROPHONE.classList.remove('mic-active')
  }
  if(isCONTROL === false){
    recognition.start()
  }
  if(isCONTROL === true){
    recognition.stop()
  }
 
})

document.querySelector('#selector').addEventListener('change', function() {
  language = this.value;
  showResults()
  moment.locale(language)
  recognition.lang = language;
  localStorage.setItem('language',language)
})