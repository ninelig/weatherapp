# 🌤️ Weather App

A JavaScript weather app that fetches current weather and 5-day forecast data using the **OpenWeather API**. The app includes:

- 🌍 City search
- ⭐ Favorite city support (with `localStorage`)
- 🌡️ Temperature unit toggle (°C / °F)
- 🎨 Background gradient changes based on weather condition and temperature
- 🌗 Light/Dark mode toggle
- 📅 5-day forecast display

---

## 🚀 Features

- **Search weather** by city name.
- **Mark cities as favorites** and quickly access them.
- **Store preferences** like last viewed city and unit system (Celsius/Fahrenheit) in `localStorage`.
- **Responsive layout** with dynamic updates.
- **Custom weather icons** mapped from OpenWeather condition codes.

---

## 🛠️ Tech Stack

- HTML5
- CSS3
- JavaScript (ES6)
- OpenWeather API
- `localStorage`

---

## 📁 File Structure

```
weather-app/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── weather/
│       ├── clear.svg
│       ├── clouds.svg
│       └── ...
└── README.md
```

---

## 🔑 API Key Setup

1. Sign up at [https://openweathermap.org/api](https://openweathermap.org/api)
2. Replace the following line in `script.js` with your key:

```js
const apiKey = 'YOUR_API_KEY_HERE';
```

---

## ⚙️ Functionality Overview

### 🔹 Initialization

```js
init();
```

- Gets the last viewed or favorited city
- Fetches its weather and forecast
- Updates UI accordingly

### 🔹 Favorites

```js
favBtn.addEventListener('click', () => {
  // Add or remove city from localStorage favorites
});
```

- Toggle favorite status
- Update star icon
- Save updated list in `localStorage`

### 🔹 Unit Toggle

```js
unitToggleBtn.addEventListener('click', () => {
  // Switch between Celsius and Fahrenheit
});
```

- Converts temperature values
- Reloads weather info

### 🔹 Theme Switcher

```js
themeTogglerEl.addEventListener('click', () => {
  // Toggle between light and dark themes
});
```

- Applies custom CSS variables

---

## 🌤️ Weather & Forecast

- Current weather is fetched from:
  - `https://api.openweathermap.org/data/2.5/weather`
- Forecast is fetched from:
  - `https://api.openweathermap.org/data/2.5/forecast`

### 🔹 Forecast Logic

```js
updateForecastsInfo(city);
```

- Group forecast data by date
- Show min/max temps
- Pick 12:00 PM data point for each day

### 🔹 Forecast UI Example

```html
<div class="forecast-item">
  <h5 class="forecast-item-date">12 Jul</h5>
  <img src="assets/weather/rain.svg" />
  <h5 class="forecast-item-temp">22 - 26 °C</h5>
</div>
```

---

## 🎨 Dynamic Background

```js
function updateBackground(id, temp) {
  // Change gradient background based on weather ID and temperature
}
```

- Thunderstorm: dark gray
- Rain: blue gradient
- Snow: light blue
- Clear: yellow/orange
- Hot/Cold override: red or icy blue

---

## 📦 Utility Functions

### Temperature Conversion

```js
function celsius2fahrenheit(celsius) {
  return Math.round((celsius * 9 / 5) + 32);
}
```

### Get City from localStorage

```js
function getCityListFromLocalStorage() {
  return JSON.parse(localStorage.getItem('cities')) || [];
}
```

### Toggle Preloader

```js
function togglePreloader(show) {
  preloaderEl.style.display = show ? 'flex' : 'none';
}
```

---

## 📌 LocalStorage Keys

| Key                   | Description                      |
|-----------------------|----------------------------------|
| `lastViewedCity`      | Last city searched or selected   |
| `cities`              | Array of favorite city names     |
| `temperatureScaleUnit`| User's preferred temp unit       |

---

## 📬 License

MIT License – Free to use, modify, and share.

---

## 🙌 Acknowledgments

- [OpenWeather](https://openweathermap.org/)
- Inspired by clean and minimal weather apps
