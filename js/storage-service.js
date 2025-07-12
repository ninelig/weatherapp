export class StorageService {
  constructor() {
    this.key = 'cities';
    
  }

  getCities() {
    return JSON.parse(localStorage.getItem(this.key)) || [];
  }

  isFavorite(city) {
    return this.getCities().includes(city.toLowerCase());
  }
  
  setTemperatureScaleUnit(unit) {
     localStorage.setItem('temperatureScaleUnit', unit); 
  }

  getTemperatureScaleUnit() {
     return localStorage.getItem('temperatureScaleUnit') || 'C'; 
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