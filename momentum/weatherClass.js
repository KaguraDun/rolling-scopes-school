class Weather {
  constructor(city, icon, temperature, description, wind, humidity) {
    this.city = document.querySelector(city);
    this.icon = document.querySelector(icon);
    this.temperature = document.querySelector(temperature);
    this.wind = document.querySelector(wind);
    this.humidity = document.querySelector(humidity);
    this.description = document.querySelector(description);
    this.apiKey = "53a66db7ddc6598b5427215dbd363f56";
  }

  getCity() {
    if (localStorage.getItem("city") == null) {
      this.city.textContent = "[Enter City]";
    } else {
      this.city.textContent = localStorage.getItem("city");
      this.getWeather();
    }
  }

  setCity = (e) => {
    if (e.type == "keypress") {
      if (e.key == "Enter") {
        if (this.city.textContent.trim() != "") {
          localStorage.setItem("city", this.city.textContent);
          this.city.blur();
        } else {
          this.getCity();
          this.city.blur();
        }
        this.getWeather();
      }
    } else {
      if (this.city.textContent.trim() != "") {
        localStorage.setItem("city", this.city.textContent);
        this.getWeather();
      } else {
        this.getCity();
      }
    }
  };

  async getWeather() {
    console.log(this.city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city.textContent}&lang=en&appid=${this.apiKey}&units=metric`;
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();

      this.icon.className = "weather-icon owf";
      this.icon.classList.add(`owf-${data.weather[0].id}`);
      this.temperature.textContent = `${data.main.temp.toFixed(0)}°C`;
      this.wind.textContent = `${data.wind.speed}m/s`;
      this.humidity.textContent = `${data.main.humidity}%`;
      this.description.textContent = data.weather[0].description;
    } else {
      this.city.textContent = "[CITY NOT FOUND]";
      this.icon.className = "weather-icon";
      this.temperature.textContent = `?°C`;
      this.wind.textContent = `?m/s`;
      this.humidity.textContent = `?%`;
      this.description.textContent = `?`;
    }
  }
}
