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

    this.recentContainer = document.getElementById("recentSearches");
    this.clearBtn = document.getElementById("clearHistoryBtn");

    this.recentSearches = [];
}

WeatherApp.prototype.init = function () {

    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });

    if (this.clearBtn) {
        this.clearBtn.addEventListener("click", this.clearHistory.bind(this));
    }

    this.loadRecentSearches();
    this.loadLastCity();
};

WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();
    if (!city) return;

    this.getWeather(city);
    this.cityInput.value = "";
};

WeatherApp.prototype.getWeather = async function (city) {

    try {

        this.showLoading();

        const weatherURL =
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

        const forecastURL =
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

        const [weatherRes, forecastRes] = await Promise.all([
            axios.get(weatherURL),
            axios.get(forecastURL)
        ]);

        this.displayWeather(weatherRes.data);
        this.displayForecast(forecastRes.data);

        this.saveRecentSearch(city);
        localStorage.setItem("lastCity", city);

        this.messageDiv.innerHTML = "";

    } catch (error) {
        this.showError("City not found. Please try again.");
    }
};

WeatherApp.prototype.displayWeather = function (data) {
    this.cityName.textContent = data.name;
    this.temperature.textContent = "Temperature: " + data.main.temp + "°C";
    this.description.textContent = "Condition: " + data.weather[0].description;
    this.icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
};

WeatherApp.prototype.displayForecast = function (data) {

    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    this.forecastContainer.innerHTML = "";

    daily.slice(0, 5).forEach(item => {

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

WeatherApp.prototype.saveRecentSearch = function (city) {

    city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

    this.recentSearches = this.recentSearches.filter(c => c !== city);
    this.recentSearches.unshift(city);

    if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
    }

    localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));

    this.displayRecentSearches();
};

WeatherApp.prototype.loadRecentSearches = function () {

    const saved = localStorage.getItem("recentSearches");

    if (saved) {
        this.recentSearches = JSON.parse(saved);
        this.displayRecentSearches();
    }
};

WeatherApp.prototype.displayRecentSearches = function () {

    this.recentContainer.innerHTML = "";

    this.recentSearches.forEach(city => {

        const btn = document.createElement("button");
        btn.textContent = city;
        btn.className = "recent-btn";

        btn.addEventListener("click", () => {
            this.getWeather(city);
        });

        this.recentContainer.appendChild(btn);
    });
};

WeatherApp.prototype.loadLastCity = function () {

    const lastCity = localStorage.getItem("lastCity");

    if (lastCity) {
        this.getWeather(lastCity);
    }
};

WeatherApp.prototype.clearHistory = function () {
    localStorage.removeItem("recentSearches");
    localStorage.removeItem("lastCity");
    this.recentSearches = [];
    this.displayRecentSearches();
};

WeatherApp.prototype.showLoading = function () {
    this.messageDiv.innerHTML = "<p>Loading...</p>";
};

WeatherApp.prototype.showError = function (msg) {
    this.messageDiv.innerHTML = `<p class="error">${msg}</p>`;
};

const app = new WeatherApp();
app.init();