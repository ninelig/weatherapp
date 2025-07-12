export class WeatherService {
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

  static celsius2fahrenheit(celsius) {
    if (isNaN(celsius)) {
      return '';
    }

    const result = (celsius* 9/5) + 32;

    return Math.round(result);
  }


  static fahrenheit2celsius(fahrenheit) {
    if (isNaN(fahrenheit)) {
        return '';
    }

    const result = (fahrenheit - 32) * 5/9;

    return Math.round(result);
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
