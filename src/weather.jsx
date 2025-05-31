import React, { useEffect, useState } from "react";
const WEATHER_API_KEY = "4619377c239cecd1746d067d30c563ea";
const GEOLOC_API_KEY = "6af728aeed53462188f07d46f4e8f462";

const WeatherForecast = () => {
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [weatherData, setWeatherData] = useState(null);
    const [emoji, setEmoji] = useState("");
    const [backgroundClass, setBackgroundClass] = useState("bg-gradient-to-r from-blue-400 to-cyan-300");

    const fetchWeather = async () => {
        if (!city || !country) return alert("Please enter both city and country.");

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${WEATHER_API_KEY}&units=metric`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    alert(`City "${city}" not found. Please try entering appropriate near by city name.`);
                }
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setWeatherData(data);
            const emoji = getWeatherEmoji(data.weather[0].main, setBackgroundClass);
            setEmoji(emoji);
        } catch (error) {
            //   alert("Error fetching weather data");
        }
    };

    const getCurrentLocation = async (lat, lon) => {
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${GEOLOC_API_KEY}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            const components = data?.results?.[0]?.components || {};
            setCity(components.city || components.town || components.village || "");
            setCountry(components.country_code.toUpperCase() || "");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                getCurrentLocation(latitude, longitude);
            },
            (err) => {
                console.error("Location access denied or unavailable.", err);
            }
        );
    }, []);

    return (
        <div className={`min-h-screen p-6 transition-all ${backgroundClass}`}>
            <div className="max-w-md mx-auto bg-white/80 rounded-xl shadow-md p-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Weather Forecast 🌤️</h1>
                <div className="mb-4">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        className="w-full mb-2 px-4 py-2 rounded border"
                    />
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                        className="w-full px-4 py-2 rounded border"
                    />
                </div>
                <button
                    onClick={fetchWeather}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Fetch Weather Data
                </button>

                {weatherData && (
                    <div className="mt-6">
                        <div className="text-4xl">{emoji}</div>
                        <h2 className="text-xl font-semibold">
                            {weatherData.name}, {weatherData.sys.country}
                        </h2>
                        <p>Temperature: {weatherData.main.temp}°C</p>
                        <p>Feels Like: {weatherData.main.feels_like}°C</p>
                        <p>Humidity: {weatherData.main.humidity}%</p>
                        <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                        <p>Description: {weatherData.weather[0].description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const getWeatherEmoji = (condition, setBackground) => {
    const bgMap = {
        clear: ["☀️", "bg-yellow-300"],
        clouds: ["☁️", "bg-blue-200"],
        rain: ["🌧️", "bg-blue-300"],
        drizzle: ["🌦️", "bg-blue-300"],
        snow: ["❄️", "bg-cyan-100"],
        thunderstorm: ["⛈️", "bg-gray-500"],
        lightning: ["🌩️", "bg-gray-500"],
        mist: ["🌫️", "bg-gray-300"],
        haze: ["🌁", "bg-gray-300"],
        smoke: ["🌫️", "bg-gray-300"],
        fog: ["🌫️", "bg-gray-300"],
        cyclone: ["🌀", "bg-gray-400"],
        tornado: ["🌪️", "bg-gray-400"],
        cool: ["🥶", "bg-blue-200"],
        sunny: ["🌞", "bg-yellow-300"],
        rainbow: ["🌈", "bg-pink-200"]
    };

    const [emoji, bgClass] = bgMap[condition.toLowerCase()] || ["🌍", "bg-gradient-to-r from-blue-400 to-cyan-300"];
    setBackground(bgClass);
    return emoji;
};

export default WeatherForecast;
