const apiKey = 'a3f02f52d7fd9e29cb854bb671577488'; 
const searchButton = document.getElementById('search-button');
const cityInput = document.getElementById('city-input');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const historyList = document.getElementById('history-list');

searchButton.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        fetchWeather(city);
        addToHistory(city);
    }
});

historyList.addEventListener('click', (event) => {
    if (event.target.tagName === 'LI') {
        fetchWeather(event.target.textContent);
    }
});

function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayForecast(data);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

function displayCurrentWeather(data) {
    const city = data.city.name;
    const date = new Date(data.list[0].dt * 1000).toLocaleDateString();
    const temp = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;
    const weatherIcon = data.list[0].weather[0].icon;

    currentWeatherDiv.innerHTML = `
        <h2>${city} (${date})</h2>
        <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather icon">
        <p>Temperature: ${temp} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function displayForecast(data) {
    forecastDiv.innerHTML = '';
    for (let i = 1; i < data.list.length; i += 8) {
        const date = new Date(data.list[i].dt * 1000).toLocaleDateString();
        const temp = data.list[i].main.temp;
        const humidity = data.list[i].main.humidity;
        const windSpeed = data.list[i].wind.speed;
        const weatherIcon = data.list[i].weather[0].icon;

        forecastDiv.innerHTML += `
            <div>
                <h3>${date}</h3>
                <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather icon">
                <p>Temp: ${temp} °C</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind: ${windSpeed} m/s</p>
            </div>
        `;
    }
}

function addToHistory(city) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('history', JSON.stringify(history));
        renderHistory();
    }
}

function renderHistory() {
    historyList.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('history')) || [];
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        historyList.appendChild(li);
    });
}

renderHistory();
