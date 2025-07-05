document.addEventListener('DOMContentLoaded', () => {
  const app = new WeatherApp();
  app.init();
});

// -----------------------------
// WeatherApp
// -----------------------------
class WeatherApp {
  constructor() {
    this.apiKey = '4839457010f81ec76815df2b63a09a87';
    this.weatherService = new WeatherService(this.apiKey);
    this.storageService = new StorageService();
    this.ui = new UI();

    this.initEventListeners();
  }

  init() {
    const cities = this.storageService.getCities();
    if (cities.length) {
      const lastCity = cities[cities.length - 1];
      this.updateWeather(lastCity);
    }
  }

  initEventListeners() {
    this.ui.cityInput.addEventListener('focus', () => this.ui.showCityDropdown(this.storageService.getCities(), this.updateWeather.bind(this)));

    this.ui.searchBtn.addEventListener('click', () => {
      const city = this.ui.cityInput.value.trim();
      if (city) {
        this.updateWeather(city);
        this.ui.resetInput();
      }
    });

    this.ui.cityInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const city = this.ui.cityInput.value.trim();
        if (city) {
          this.updateWeather(city);
          this.ui.resetInput();
        }
      }
    });

    this.ui.favBtn.addEventListener('click', () => this.toggleFavorite());
  }

  async updateWeather(city) {
    const data = await this.weatherService.getCurrentWeather(city);
    if (!data || data.cod !== 200) {
      this.ui.showSection('notFound');
      return;
    }

    const forecasts = await this.weatherService.getForecast(city);

    this.ui.updateWeatherDisplay(data);
    this.ui.updateForecastDisplay(forecasts);
    this.ui.showSection('weatherInfo');

    const isFavorite = this.storageService.isFavorite(data.name);
    this.ui.updateFavButton(isFavorite);
  }

  toggleFavorite() {
    const cityName = this.ui.getCityName();
    if (!cityName) return;

    const isNowFavorite = this.storageService.toggleFavorite(cityName);
    this.ui.updateFavButton(isNowFavorite);
  }
}

// -----------------------------
// WeatherService
// -----------------------------
class WeatherService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5/';
  }

  async fetch(endpoint, city) {
    const url = `${this.baseUrl}${endpoint}?q=${city}&appid=${this.apiKey}&units=metric`;
    const response = await fetch(url);
    return await response.json();
  }

  getCurrentWeather(city) {
    return this.fetch('weather', city);
  }

  getForecast(city) {
    return this.fetch('forecast', city);
  }

  static getWeatherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg';
    if (id <= 321) return 'drizzle.svg';
    if (id <= 531) return 'rain.svg';
    if (id <= 622) return 'snow.svg';
    if (id <= 781) return 'atmosphere.svg';
    if (id === 800) return 'clear.svg';
    return 'clouds.svg';
  }

  static getFormattedDate() {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
    });
  }
}

// -----------------------------
// StorageService
// -----------------------------
class StorageService {
  constructor() {
    this.key = 'cities';
  }

  getCities() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }

  isFavorite(city) {
    return this.getCities().includes(city.toLowerCase());
  }

  toggleFavorite(city) {
    let cities = this.getCities();
    const cityLower = city.toLowerCase();

    if (cities.includes(cityLower)) {
      cities = cities.filter(c => c !== cityLower);
    } else {
      cities.push(cityLower);
    }

    if (cities.length === 0) {
      localStorage.removeItem(this.key);
    } else {
      localStorage.setItem(this.key, JSON.stringify(cities));
    }

    return cities.includes(cityLower);
  }
}

// -----------------------------
// UI
// -----------------------------
class UI {
  constructor() {
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
    this.favBtn = document.querySelector('#favBtn');
    this.cityNameEl = document.querySelector('#city-name');
    this.citySelEl = document.querySelector('#citySelection');
  }

  resetInput() {
    this.cityInput.value = '';
    this.cityInput.blur();
    this.citySelEl.innerHTML = '';
  }

  getCityName() {
    return this.cityNameEl.textContent.trim();
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

    this.countryTxt.textContent = name;
    this.tempTxt.textContent = Math.round(temp) + '°C';
    this.conditionTxt.textContent = main;
    this.humidityValueTxt.textContent = humidity + '%';
    this.windValueTxt.textContent = speed + 'M/s';
    this.currentDateTxt.textContent = WeatherService.getFormattedDate();
    this.weatherSummaryImg.src = `assets/weather/${WeatherService.getWeatherIcon(id)}`;
    this.cityNameEl.textContent = name;
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

      const forecastItem = `
        <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">${date}</h5>
          <img src="assets/weather/${WeatherService.getWeatherIcon(id)}" class="firecast-item-img">
          <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
      `;

      this.forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem);
    });
  }

  updateFavButton(isFavorite) {
    this.favBtn.innerHTML = isFavorite ? 'stars' : 'star';
    this.favBtn.classList.remove('hidden');
  }
}
