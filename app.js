function WeatherApp() {
    this.apiKey = "a6e084fad0f0a87d969a516f85b946ec";

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.messageDiv = document.getElementById("message");

    this.cityName = document.getElementById("city-name");
    this.temperature = document.getElementById("temperature");
    this.description = document.getElementById("description");
    this.icon = document.getElementById("weather-icon");

    this.forecastContainer = document.getElementById("forecast");
}

WeatherApp.prototype.init = function () {
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));
    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });

    this.showWelcome();
};

WeatherApp.prototype.showWelcome = function () {
    this.messageDiv.innerHTML = "<p>Search for a city to see weather and forecast.</p>";
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    this.getWeather(city);
    this.cityInput.value = "";
};

WeatherApp.prototype.getWeather = async function (city) {
    try {
        this.showLoading();

        const currentWeatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

        const [weatherResponse, forecastResponse] = await Promise.all([
            axios.get(currentWeatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(weatherResponse.data);
        this.displayForecast(forecastResponse.data);

        this.messageDiv.innerHTML = "";

    } catch (error) {
        this.showError("City not found. Please try again.");
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    this.cityName.textContent = data.name;
    this.temperature.textContent = "Temperature: " + data.main.temp + "°C";
    this.description.textContent = "Condition: " + data.weather[0].description;

    const iconCode = data.weather[0].icon;
    this.icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

WeatherApp.prototype.displayForecast = function (data) {
    const dailyForecasts = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    this.forecastContainer.innerHTML = "";

    dailyForecasts.slice(0, 5).forEach(item => {
        const date = new Date(item.dt_txt);
        const day = date.toLocaleDateString("en-US", { weekday: "long" });

        const card = `
            <div class="forecast-card">
                <h4>${day}</h4>
                <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">
                <p>${item.main.temp}°C</p>
                <p>${item.weather[0].description}</p>
            </div>
        `;

        this.forecastContainer.innerHTML += card;
    });
};

WeatherApp.prototype.showLoading = function () {
    this.messageDiv.innerHTML = "<p>Loading...</p>";
};

WeatherApp.prototype.showError = function (message) {
    this.messageDiv.innerHTML = `<p class="error">${message}</p>`;
};

const app = new WeatherApp();
app.init();