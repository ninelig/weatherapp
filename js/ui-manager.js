import { WeatherService } from './wheather-service.js';

export class UI {
  constructor() {
    this.mainContainer = document.querySelector('#main-container');
    this.sectionsContainer = document.querySelector('#sections-container');
    this.cityInput = document.querySelector('.city-input');
    this.searchBtn = document.querySelector('.search-btn');
    this.notFoundSection = document.querySelector('.not-found');
    this.searchCitySection = document.querySelector('.search-city');
    this.weatherInfoSection = document.querySelector('.weather-info');
    this.countryTxt = document.querySelector('.country-txt');
    this.tempTxt = document.querySelector('.temp-txt');
    this.conditionTxt = document.querySelector('.condition-txt');
    this.humidityValueTxt = document.querySelector('.humidity-value-txt');
    this.windValueTxt = document.querySelector('.wind-value-txt');
    this.weatherSummaryImg = document.querySelector('.weather-summary-img');
    this.currentDateTxt = document.querySelector('.current-date-txt');
    this.forecastItemsContainer = document.querySelector('.forecast-items-container');
    this.favBtn = document.querySelector('#fav-btn');
    this.cityNameEl = document.querySelector('#city-name');
    this.citySelEl = document.querySelector('#citySelection');
    this.preloaderEl = document.querySelector('.preloader');
    this.unitToggleBtn = document.querySelector('#unit-toggle');
  }

  resetInput() {
    this.cityInput.value = '';
    this.cityInput.blur();
    this.citySelEl.innerHTML = '';
  }

  getCityName() {
    return this.cityNameEl.textContent.trim();
  }

  togglePreloader(show) {
    this.preloaderEl.style.display = show ? 'flex' : 'none';
  }

  updateUnitToggleButton(currentScale) {
    this.unitToggleBtn.textContent = currentScale === 'C' ? 'Switch to °F' : 'Switch to °C';
  }

  showCityDropdown(cities, onSelectCity) {
    this.citySelEl.innerHTML = '';
    const ul = document.createElement('ul');

    cities.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      li.classList.add('city-sel-item');
      li.addEventListener('click', () => {
        onSelectCity(city);
        this.citySelEl.innerHTML = '';
      });
      ul.appendChild(li);
    });

    this.citySelEl.appendChild(ul);
  }

  hideCityDropdown() {
     this.citySelEl.innerHTML = '';
  }

  showSection(sectionName) {
    const sections = {
      weatherInfo: this.weatherInfoSection,
      searchCity: this.searchCitySection,
      notFound: this.notFoundSection,
    };

    Object.values(sections).forEach(s => s.style.display = 'none');
    if (sections[sectionName]) {
      sections[sectionName].style.display = 'flex';
    }
  }

  updateWeatherDisplay(data) {
    const {
      name,
      main: { temp, humidity },
      weather: [{ id, main }],
      wind: { speed },
    } = data;

    const scale = localStorage.getItem('temperatureScaleUnit');
    const displayTemp = scale === 'C' 
    ? Math.round(temp) + ' °C'
    : WeatherService.celsius2fahrenheit(temp) + ' °F';

    this.countryTxt.textContent = name;
    this.tempTxt.innerHTML = displayTemp;
    this.conditionTxt.textContent = main;
    this.humidityValueTxt.textContent = humidity + ' %';
    this.windValueTxt.textContent = speed + ' m/s';
    this.currentDateTxt.textContent = WeatherService.getFormattedDate();
    this.weatherSummaryImg.src = `assets/weather/${WeatherService.getWeatherIcon(id)}`;
    this.cityNameEl.textContent = name;

    // Update background
    this.setWeatherBackground(id, temp);
  }

  updateForecastDisplay(forecastData) {

    
    const items = forecastData.list.filter(item =>
      item.dt_txt.includes('12:00:00') &&
      !item.dt_txt.includes(new Date().toISOString().split('T')[0])
    );
    
    this.forecastItemsContainer.innerHTML = '';
    items.forEach(({ dt_txt, main: { temp }, weather: [{ id }] }) => {
      const date = new Date(dt_txt).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
      });
      

    const scale = localStorage.getItem('temperatureScaleUnit');
    const displayTemp = scale === 'C' 
      ? Math.round(temp) + ' °C'
      : WeatherService.celsius2fahrenheit(temp) + ' °F';

      const forecastItem = `
        <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">${date}</h5>
          <img src="assets/weather/${WeatherService.getWeatherIcon(id)}" class="firecast-item-img">
          <h5 class="forecast-item-temp">${displayTemp}</h5>
        </div>
      `;

      this.forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
    });
  }

  setWeatherBackground(id, temp) {
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
/*   if (temp <= 0) {
    gradient = 'linear-gradient(to top, #83a4d4, #b6fbff)'; // Freezing cold
  } else if (temp >= 30) {
    gradient = 'linear-gradient(to top, #ff512f, #f09819)'; // Hot
  } */

  container.style.background = gradient;
}

  updateFavButton(isFavorite) {
    this.favBtn.innerHTML = isFavorite ? 'stars' : 'star';
    this.favBtn.classList.remove('hidden');
  }
}
