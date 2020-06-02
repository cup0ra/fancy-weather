const moment = require('moment-timezone');

export default async function showTicker(result){
    document.getElementById('footer').innerHTML = ''
    const ticker = document.createElement('div')
    ticker.classList = 'ticker'
    ticker.innerHTML = ` <div class="marquee"><span class="tickers">
          <span>
          ${    moment.unix(result.daily[1].dt).format('D  MMM , dddd')}
           ${Math.round(result.daily[1].temp.night)}° -  ${Math.round(result.daily[1].temp.day)}° 
           ${result.daily[1].weather[0].description}
           </span>
          <span>
          ${    moment.unix(result.daily[2].dt).format('D  MMM, dddd')} 
          ${Math.round(result.daily[2].temp.night)}° -  ${    Math.round(result.daily[2].temp.day)}°
           ${result.daily[2].weather[0].description}
          </span>     
          <span>
          ${    moment.unix(result.daily[3].dt).format('D  MMM, dddd')} 
          ${Math.round(result.daily[3].temp.night)}° -  ${    Math.round(result.daily[3].temp.day)}° 
          ${result.daily[3].weather[0].description}
          </span>
          <span>
          ${    moment.unix(result.daily[4].dt).format('D  MMM, dddd')} 
          ${Math.round(result.daily[4].temp.night)}° -   ${    Math.round(result.daily[4].temp.day)}° 
          ${result.daily[4].weather[0].description}
          </span>
          <span>
          ${    moment.unix(result.daily[5].dt).format('D  MMM, dddd')} 
          ${Math.round(result.daily[5].temp.night)}° -   ${Math.round(result.daily[5].temp.day)}° 
          ${result.daily[5].weather[0].description}
          </span>
          <span>
          ${    moment.unix(result.daily[6].dt).format('D  MMM, dddd')} 
          ${Math.round(result.daily[6].temp.night)}° -   ${ Math.round(result.daily[6].temp.day)}° 
          ${result.daily[6].weather[0].description}
          </span>
          <span>
          ${    moment.unix(result.daily[7].dt).format('D  MMM, dddd')} 
          ${Math.round(result.daily[7].temp.night)}° -  ${    Math.round(result.daily[7].temp.day)}° 
          ${result.daily[7].weather[0].description}
          </span>
    </span></div>`
    document.getElementById('footer').append(ticker)
    
  }