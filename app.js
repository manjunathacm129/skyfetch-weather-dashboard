const apiKey = "a6e084fad0f0a87d969a516f85b946ec";
const city = "London";

const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(apiUrl)
    .then(function (response) {

        const data = response.data;

        document.getElementById("city-name").textContent = data.name;
        document.getElementById("temperature").textContent = "Temperature: " + data.main.temp + "°C";
        document.getElementById("description").textContent = "Condition: " + data.weather[0].description;

        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        document.getElementById("weather-icon").src = iconUrl;

    })
    .catch(function (error) {
        console.log("Error:", error);
    });