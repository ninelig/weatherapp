
const mainContainer = document.querySelector('#main-container');
const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection = document.querySelector('.not-found');
const searchCitySection = document.querySelector('.search-city');
const weatherInfoSection = document.querySelector('.weather-info');
const countryTxt = document.querySelector('.country-txt');
const tempTxt = document.querySelector('.temp-txt');
const conditionTxt = document.querySelector('.condition-txt');
const humidityValueTxt = document.querySelector('.humidity-value-txt');
const windValueTxt = document.querySelector('.wind-value-txt');
const weatherSummaryImg = document.querySelector('.weather-summary-img');
const currentDateTxt = document.querySelector('.current-date-txt');
const forecastItemsContainer = document.querySelector('.forecast-items-container')
const favBtn = document.querySelector('#fav-btn')
const cityNameEl = document.querySelector('#city-name')
const citySelEl = document.querySelector('#citySelection');
const preloaderEl = document.querySelector('.preloader');
const unitToggleBtn = document.querySelector('#unit-toggle');
const sectionsContainer = document.querySelector('#sections-container');
const googleMapLinkEl = document.querySelector('.google-map-link');
const themeTogglerEl = document.querySelector('#theme-switcher');

const apiKey = '4839457010f81ec76815df2b63a09a87'


// Init app
init();


async function init() {

    // Get last viewed city
    const city = getLastViewedCity();

    if (city) {

        // Update the weather info
       await updateWeatherInfo(city);

        // set correct icon for fav button
        if (getCityName()) {
            favBtn.textContent = cityExists(getCityName()) ? 'stars' : 'star';
            favBtn.classList.remove('hidden');
        }
    }


    initEventListeners()
}

function getLastViewedCity() {
    let city = localStorage.getItem('lastViewedCity');

    if (city) {
        return city;
    }

    const cities = getCityListFromLocalStorage();
    if (cities.length) {
        return cities[cities.length - 1];
    }

    return null;
}

function initEventListeners() {
    // Favs
    favBtn.addEventListener('click', () => {
        const cityName = getCityName();

        if (!cityName) {
            return;
        }


        let existingCities = getCityListFromLocalStorage();

        if (existingCities.includes(cityName.toLowerCase())) {
            existingCities = existingCities.filter(city => city !== cityName.toLowerCase());
            favBtn.innerHTML = 'star';
        } else {
            existingCities.push(cityName.toLowerCase());
            favBtn.innerHTML = 'stars';
        }

        if (!existingCities?.length) {
            localStorage.removeItem('cities');
        } else {
            localStorage.setItem('cities', JSON.stringify(existingCities));
        }



    });


    // Search by clicking on search button
    searchBtn.addEventListener('click', () => {
        if (cityInput.value.trim() != '') {
            updateWeatherInfo(cityInput.value);
            cityInput.value = '';
            cityInput.blur();
            citySelEl.innerHTML = '';

        }

    })

    // Search by Enter key
    cityInput.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' &&
            cityInput.value.trim() != ''
        ) {
            updateWeatherInfo(cityInput.value)
            cityInput.value = ''
            cityInput.blur()
        }
    })



    // Temperature scale switcher
    unitToggleBtn.addEventListener('click', () => {
        const currentScale = getTemperatureScaleUnit();
        const newScale = (currentScale === 'C') ? 'F' : 'C';
        setTemperatureScaleUnit(newScale);
        updateUnitToggleButton(newScale);

        const city = getCityName();
        if (city) {
            updateWeatherInfo(city);
        }
    });


    // Hide favs dropdown
    sectionsContainer.addEventListener('click', () => {
        hideCityDropdown();
    });

    // Theme toggler
    themeTogglerEl.addEventListener('click', (evt) => {

        if (evt.currentTarget.checked) {
            document.documentElement.style.setProperty('--main-bg', 'var(--bg-light)');
            document.documentElement.style.setProperty('--main-color', 'var(--text-light)');
            document.documentElement.style.setProperty('--main-bg-rgb', 'var(--bg-light-rgb)');
            document.documentElement.style.setProperty('--main-color-rgb', 'var(--text-light-rgb)');
        } else {
            document.documentElement.style.setProperty('--main-bg', 'var(--bg-dark)');
            document.documentElement.style.setProperty('--main-color', 'var(--text-dark)');
            document.documentElement.style.setProperty('--main-bg-rgb', 'var(--bg-dark-rgb)');
            document.documentElement.style.setProperty('--main-color-rgb', 'var(--text-dark-rgb)');
        }


    });

}

function updateUnitToggleButton(currentScale) {
    unitToggleBtn.textContent = (currentScale === 'C') ? 'Switch to °F' : 'Switch to °C';
}


function getCityName() {
    return cityNameEl.textContent.trim();
}



function getCityListFromLocalStorage() {
    const data = localStorage.getItem('cities');
    if (!data) {
        return [];
    }
    return JSON.parse(data);
}



function cityExists(city) {
    const cities = getCityListFromLocalStorage();
    if (cities?.length && cities.includes(city?.toLowerCase())) {

        return true;
    }

    return false;
}


function setTemperatureScaleUnit(unit) {
    localStorage.setItem('temperatureScaleUnit', unit);
}


function getTemperatureScaleUnit() {
    return localStorage.getItem('temperatureScaleUnit') || 'C';
}



cityInput.addEventListener('focus', () => {

    showCityDropdown(getCityListFromLocalStorage(), updateWeatherInfo)
});



function showCityDropdown(cities, onSelectCity) {
    citySelEl.innerHTML = '';
    const ul = document.createElement('ul');

    cities.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.classList.add('city-sel-item');
        li.addEventListener('click', () => {
            onSelectCity(city);
            hideCityDropdown();
        });
        ul.appendChild(li);
    });

    citySelEl.appendChild(ul);
}

function hideCityDropdown() {
    citySelEl.innerHTML = '';
}




async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }
    return currentDate.toLocaleDateString('en-GB', options)
}

async function updateWeatherInfo(city) {
    togglePreloader(true)
    const weatherData = await getFetchData('weather', city)
    if (weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        togglePreloader(false)
        return
    }

    // Store last viewed city
    localStorage.setItem('lastViewedCity', city);
    console.log(weatherData);
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
        coord: { lat, lon }
    } = weatherData



    const scaleUnit = getTemperatureScaleUnit();
    const displayTemp = scaleUnit === 'C'
        ? Math.round(temp) + ' °C'
        : celsius2fahrenheit(temp) + ' °F';

    const link = `https://www.google.com/maps?q=${lat},${lon}`
    googleMapLinkEl.setAttribute('href', link)
    googleMapLinkEl.setAttribute('target', '_blank')
    countryTxt.textContent = country
    tempTxt.textContent = displayTemp
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + ' %'
    windValueTxt.textContent = speed + ' M/s'

    updateBackground(id, temp)


    currentDateTxt.textContent = getCurrentDate()
    console.log(getCurrentDate())
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`

    await updateForecastsInfo(city)
    togglePreloader(false)
    showDisplaySection(weatherInfoSection)
}


async function updateForecastsInfo(city) {
    const forecastsData = await getFetchData('forecast', city);

    forecastItemsContainer.innerHTML = '';


    const todayDate = new Date().toISOString().split('T')[0]

    // Group forecast data by date
    const dailyForecasts = {};

    forecastsData.list.forEach(item => {
        if (!item.dt_txt.includes(todayDate)) {
            const date = item.dt_txt.split(' ')[0]; // 'YYYY-MM-DD'
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = [];
            }
            dailyForecasts[date].push(item);
        }
    });

    console.log('===', dailyForecasts)

    // Loop through each day
    Object.keys(dailyForecasts).forEach(date => {
        const dayData = dailyForecasts[date];

        let minTemp = Infinity;
        let maxTemp = -Infinity;
        let forecast = null;

        dayData.forEach(entry => {
            const temp = Math.round(entry.main.temp);
            if (temp < minTemp) minTemp = temp;
            if (temp > maxTemp) maxTemp = temp;

            forecast = entry;
         
        });

        if (forecast) {
            updateForecastItem(forecast, minTemp, maxTemp);
        }
    });
}




function updateForecastItem(weatherData, minTemp, maxTemp) {
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = {
        day: '2-digit',
        month: 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)



    const scaleUnit = getTemperatureScaleUnit();
    let minMaxTemp = (scaleUnit === 'C') ? Math.round(minTemp) : celsius2fahrenheit(minTemp);


    if (maxTemp > minTemp) {
        const tempMaxResolved = (scaleUnit === 'C') ? Math.round(maxTemp) : celsius2fahrenheit(maxTemp);
        minMaxTemp += ` - ${tempMaxResolved}`;
    }

    minMaxTemp += (scaleUnit === 'C') ? ' °C' : ' °F'



    const forecastItem = `
          <div class="forecast-item">
                <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                <img src="assets/weather/${getWeatherIcon(id)}" class="firecast-item-img">
                <h5 class="forecast-item-temp">${minMaxTemp}</h5>
          </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}


function updateBackground(id, temp) {
    // mainContainer
    const container = document.body;

    let gradient = '';

    // Use weather ID (based on OpenWeatherMap codes)
    if (id >= 200 && id < 300) {
        gradient = 'linear-gradient(to top, #3a3a3a, #000000)'; // Thunderstorm
    } else if (id >= 300 && id < 600) {
        gradient = 'linear-gradient(to top, #4e54c8, #8f94fb)'; // Rain/Drizzle
    } else if (id >= 600 && id < 700) {
        gradient = 'linear-gradient(to top, #83a4d4, #b6fbff)'; // Snow
    } else if (id >= 700 && id < 800) {
        gradient = 'linear-gradient(to top, #bdc3c7, #2c3e50)'; // Mist/Fog
    } else if (id === 800) {
        gradient = 'linear-gradient(to top, #f7971e, #ffd200)'; // Clear
    } else if (id > 800) {
        gradient = 'linear-gradient(to top, #757f9a, #d7dde8)'; // Cloudy
    }

    // Adjust based on temp too
    if (temp <= 0) {
        gradient = 'linear-gradient(to top, #83a4d4, #b6fbff)'; // Freezing cold
    } else if (temp >= 30) {
        gradient = 'linear-gradient(to top, #ff512f, #f09819)'; // Hot
    }

    container.style.background = gradient;
}


function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .filter(s => !!s)
        .forEach(s => s.style.display = 'none')
    section.style.display = 'flex'
}

function togglePreloader(show) {
    preloaderEl.style.display = show ? 'flex' : 'none';
}


function celsius2fahrenheit(celsius) {
    if (isNaN(celsius)) {
        return '';
    }

    const result = (celsius * 9 / 5) + 32;

    return Math.round(result);
}

