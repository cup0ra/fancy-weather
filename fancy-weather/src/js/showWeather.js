const moment = require('moment-timezone');

export default function showWeather(result) {
    return  `
          <div class="weather-city"></div>
            <div class='today '>
              <div class="temp " >${Math.round(result.current.temp)}°</div>  
              <img class="today-icon " src ='../img/weather/${result.current.weather[0].icon}.svg'>
              <div class="today-weather" >
              <p class="description">${result.current.weather[0].description}  </p>
              <p class="feel"><span  data-i18n="feel"></span><span> ${Math.round(result.current.feels_like)}°</span></p>
              <p class="wind"><span data-i18n="wind"></span><span> ${Math.round(result.current.wind_speed)}</span><span data-i18n="ms"></span></p>
              <p class="humidity"><span data-i18n="humidity"></span><span> ${result.current.humidity}%</span></p>
              </div>
            <div class="days1">
              <p class="day">${moment.unix(result.daily[1].dt).format('dddd')}</p>
              <p class="days-temp">${Math.round(result.daily[1].temp.day)}°</p>
              <img class="days-icon" src="../img/weather/${result.daily[1].weather[0].icon}.svg">
            </div>
            <div class="days2">
              <p class="day">${moment.unix(result.daily[2].dt).format('dddd')}</p>
              <p class="days-temp">${Math.round(result.daily[2].temp.day)}°</p>
              <img class="days-icon" src="../img/weather/${result.daily[2].weather[0].icon}.svg">
             </div>
            <div class="days3">
              <p class="day">${moment.unix(result.daily[3].dt).format('dddd')}</p>
              <p class="days-temp">${Math.round(result.daily[3].temp.day)}°</p>
              <img class="days-icon" src="../img/weather/${result.daily[3].weather[0].icon}.svg">
            </div>
            </div>
          </div>
        `;
    }