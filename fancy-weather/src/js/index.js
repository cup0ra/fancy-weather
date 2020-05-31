/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import '../css/style.css';
import '../css/style.scss'; // require
import {getLinkToImage,getWeather,getGeocode,getGeolocation} from './moduleAPI';
import Translator from './translator';
import showWeather from './showWeather'

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
let timeDay = ''

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

moment.locale(language)
  mapboxgl.accessToken = 'pk.eyJ1IjoiY3Vwb3JhIiwiYSI6ImNrYWZtMDIydzAwMGEyenNjaXA0bW5rYm4ifQ.j0iqe20xZuIiZVDuhq3IQQ';
  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center:[0,0], // starting position [lng, lat]
  zoom: 11, // starting zoom
  language:'en'
});
const marker = new mapboxgl.Marker()

 function getCity(time) {
  const city = time.results[0].formatted.split(',');
  const locationCity = city.length === 1 ? city[0] : `${city[0]  },${city[city.length-1]}`
  COUNTRY.innerHTML = locationCity
}

function dateTime() { 
  const timeZone =localStorage.getItem('timeZone')
  document.getElementById('time').innerHTML = moment().tz(timeZone).format('LLLL');
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
 
 
async function showBackground(){
  getLinkToImage(timeYear,timeDay).then( async (img)=>{
    await checkImgSrc(img)
    document.querySelector('BODY').style=`background:url("${img}") center center no-repeat fixed;`
  }).catch(() =>{
    alert('limit is reached')
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
      getWeather(lat,lng,language,units).then(result => {
        coordinate = [result.lon,result.lat,];
        timeDays()
        timeYears()
        console.log('Season:',timeYear)
        console.log('Time of day:',timeDay)
        showBackground(searchCity)
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
        document.querySelector('.lat').innerHTML = time.results[0].annotations.DMS.lat
        document.querySelector('.lng').innerHTML = time.results[0].annotations.DMS.lng;
        localStorage.setItem('search', searchCity);
      })
      localStorage.setItem('timeZone',time.results[0].annotations.timezone.name)
      getCity(time)
      dateTime();
    }).catch(() =>{
      alert(`no result for ${searchCity}`)
      INPUT.value = ''
      searchCity = localStorage.getItem('search')

    })
  }).catch(()=>{
    alert(`no result for ${searchCity}`)
  })
  
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

document.querySelector('#selector').addEventListener('change', function() {
  language = this.value;
  showResults()
  moment.locale(language)
  localStorage.setItem('language',language)
})

document.querySelector('#scale').addEventListener('change', function() {
  units = this.value;
  showResults()
  localStorage.setItem('units',units)
})

window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const recognition = new window.SpeechRecognition();
recognition.interimResults = true;
recognition.maxAlternatives = 10;
recognition.continuous = false;
recognition.onresult = (event) => {
  const speechToText = event.results[0][0].transcript;
  INPUT.value = speechToText;
}

recognition.addEventListener('end',() => { 
  searchMovie()
  document.querySelector('.mic-img').classList.remove('mic-img-active')
  MICROPHONE.classList.remove('mic-active')
  isMIC = true
})


MICROPHONE.addEventListener('click',() => {
  if(isMIC === true){
    recognition.start();
    document.querySelector('.mic-img').classList.add('mic-img-active')
    MICROPHONE.classList.add('mic-active')
    isMIC = false
  }
})
document.querySelector('.refresh-img').addEventListener('click',() => {
  showBackground(searchCity)
})

PLAY.addEventListener('click', () =>{
  if(isPLAY === true){

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
  const voices = window.speechSynthesis.getVoices();
  speak.lang = language
  if(speak.lang === 'be'){
    speak.lang = 'ru'
  }
      window.speechSynthesis.speak(speak);
  speak.addEventListener('end',() => {
    isPLAY = true
    document.querySelector('.play').classList.remove('play-active')
    document.querySelector('.img').classList.remove('img-active')
  })
}
document.querySelector('.play').classList.add('play-active')
document.querySelector('.img').classList.add('img-active')
  }
})

