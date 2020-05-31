

export  async function getLinkToImage(timeYear,timeDay) {
    const url = `https://api.unsplash.com/photos/random?query=${timeYear} ${timeDay}&auto=format&client_id=n0rS0YBba_6PCwRYTtsw9bNQuOPFBcefP2kG8i-5NKw`;
    const res = await fetch(url);
    const data = await res.json();
    return data.urls.regular
  }

  
  export  async function getWeather(lt,lg,language,units) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lt}&lon=${lg}&lang=${language}&units=${units}&exclude={part}&appid=2065fc103d83010d4dbc57f1a1378f5a`;
    const res = await fetch(url);
    const data = await res.json();
    return data
  }
  
 export async function getGeocode(city,language) { 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${city}&language=${language}&key=7e83402beaf54ea392710dbce687face&pretty=1&no-annotations=0`;
    const res = await fetch(url);
    const data = await res.json();
    return data
  }
  
 export async function getGeolocation() {
    const url = 'https://ipinfo.io/json?token=4a00deb0d6261c';
    const res = await fetch(url);
    const data = await res.json();
    return data
  }