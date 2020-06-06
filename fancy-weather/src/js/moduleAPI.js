
const KEY_UNSPLASH = 'n0rS0YBba_6PCwRYTtsw9bNQuOPFBcefP2kG8i-5NKw';
const KEY_OPEN_WEATHER_MAP = '2065fc103d83010d4dbc57f1a1378f5a';
const KEY_GEOCODE = '7e83402beaf54ea392710dbce687face';
const KEY_LOCATION = '4a00deb0d6261c';

export  async function getLinkToImage(timeYear,timeDay) {
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=${timeYear} ${timeDay}&auto=format&client_id=${KEY_UNSPLASH}`;
    const res = await fetch(url);
    const data = await res.json();
    
    return data.urls.regular
  }

  
  export  async function getWeather(lt,lg,language,units) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lt}&lon=${lg}&lang=${language}&units=${units}&exclude={part}&appid=${KEY_OPEN_WEATHER_MAP}`;
    const res = await fetch(url);
    const data = await res.json();
   
    return data
  }
  
 export async function getGeocode(city,language) { 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&language=${language}&key=${KEY_GEOCODE}&pretty=1&no-annotations=0`;
    const res = await fetch(url);
    const data = await res.json();
    return data
  }
  
 export async function getGeolocation() {
    const url = `https://ipinfo.io/json?token=${KEY_LOCATION}`;
    const res = await fetch(url);
    const data = await res.json();
    return data
  }