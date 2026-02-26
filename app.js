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

        const data = response.data;

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