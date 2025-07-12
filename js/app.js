import { WeatherService } from './wheather-service.js';
import { UI } from './ui-manager.js';
import { StorageService } from './storage-service.js';

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


    this.ui.updateUnitToggleButton(this.storageService.getTemperatureScaleUnit());
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
    
    this.ui.unitToggleBtn.addEventListener('click', () => {
      const currentScale = this.storageService.getTemperatureScaleUnit();
      const newScale = currentScale === 'C' ? 'F' : 'C';
      this.storageService.setTemperatureScaleUnit(newScale);
      this.ui.updateUnitToggleButton(newScale);

      const city = this.ui.getCityName();
      if (city) {
        this.updateWeather(city);
      }
    });
    
    this.ui.sectionsContainer.addEventListener('click', () => {
      this.ui.hideCityDropdown();
    });
  }


  async updateWeather(city) {
    this.ui.togglePreloader(true);
    const data = await this.weatherService.getCurrentWeather(city);
    if (!data || data.cod !== 200) {
      this.ui.togglePreloader(false);
      this.ui.showSection('notFound');
      return;
    }
    
    const forecasts = await this.weatherService.getForecast(city);
    this.ui.togglePreloader(false);

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
