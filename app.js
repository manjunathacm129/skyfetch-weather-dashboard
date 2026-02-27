part-3-oop-forecast
function WeatherApp() {
    this.apiKey = "a6e084fad0f0a87d969a516f85b946ec";

    this.cityInput = document.getElementById("cityInput");
    this.searchBtn = document.getElementById("searchBtn");
    this.messageDiv = document.getElementById("message");

    this.cityName = document.getElementById("city-name");
    this.temperature = document.getElementById("temperature");
    this.description = document.getElementById("description");
    this.icon = document.getElementById("weather-icon");

const apiKey = "a6e084fad0f0a87d969a516f85b946ec";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const messageDiv = document.getElementById("message");

async function getWeather(city) {

    try {
        showLoading();
        searchBtn.disabled = true;

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
 main

    this.forecastContainer = document.getElementById("forecast");
}

 part-3-oop-forecast
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

        document.getElementById("city-name").textContent = data.name;
        document.getElementById("temperature").textContent =
            "Temperature: " + data.main.temp + "°C";
        document.getElementById("description").textContent =
            "Condition: " + data.weather[0].description;

        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        document.getElementById("weather-icon").src = iconUrl;

        messageDiv.innerHTML = "";
        searchBtn.disabled = false;

    } catch (error) {
        showError("City not found. Please enter a valid city name.");
        searchBtn.disabled = false;
    }
}

function showError(message) {
    messageDiv.innerHTML = `<p class="error">${message}</p>`;
}

function showLoading() {
    messageDiv.innerHTML = `<p class="loading">Loading...</p>`;
}

searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (city === "") {
        showError("Please enter a city name.");
        return;
    }

    getWeather(city);
    cityInput.value = "";
});

cityInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});
 main
