import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaTemperatureHigh, FaTemperatureLow } from "react-icons/fa";
import { FaLocationDot, FaWind } from "react-icons/fa6";
import { WiHumidity } from "react-icons/wi";

const apiKey = import.meta.env.VITE_REACT_APP_API_KEY;
const baseUrl = import.meta.env.VITE_REACT_APP_BASE_URL;

const Home = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState("kolkata");
    const [error, setError] = useState(null);
    const API_KEY = apiKey;

    const url = `${baseUrl}${city}&units=metric&appid=${API_KEY}`;

    const getWeather = async () => {
        try {
            const response = await axios.get(url);
            setWeatherData(response.data);
            setError(null);
        } catch (error) {
            setError(error.response.status);
        }
    };

    useEffect(() => {
        // Checking geolocation support
        if ("geolocation" in navigator) {
            try {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const { latitude, longitude } = position.coords;
                    const currenturl = `${baseUrl}lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

                    // Fetching weather data based on current location
                    try {
                        const response = await axios.get(currenturl);
                        setWeatherData(response.data);
                        setError(null);
                    } catch (error) {
                        setError("Error fetching weather data");
                        console.error("Error fetching weather data:", error);
                    }
                });
            } catch (error) {
                setError("Error getting location");
                console.error("Error getting location:", error);
            }
        } else {
            setError("Geolocation is not available");
        }
    }, []);
    return (
        <section className="w-screen h-[100vh] bg_gradient flex_center">
            <h1 className="absolute top-4 text-4xl font-bold text-purple-950 uppercase">
                Weather App
            </h1>
            <div className="w-[20rem] bg_card_gradient p-8 rounded-lg">
                <div className="relative flex items-center w-full">
                    <input
                        type="text"
                        placeholder="Enter city name"
                        id="cityInput"
                        value={city}
                        onChange={(e) => {
                            setCity(e.target.value);
                        }}
                        className="w-full bg-gray-200 p-2 rounded-lg border-none outline-none focus:bg-white"
                    />
                    <FaSearch
                        onClick={getWeather}
                        className="absolute right-4 text-xl cursor-pointer"
                    />
                </div>
                {error === null && weatherData && (
                    <div>
                        <div className="flex_col mb-8">
                            <img
                                src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                alt="image"
                                className="w-52 -mt-5"
                            />
                            <p className="-mt-9 _para">
                                {weatherData.weather[0].description}
                            </p>
                            <p className="_header_text">
                                {Math.floor(weatherData.main.temp)}°C
                            </p>
                            <p className="_para">
                                Feels like{" "}
                                {Math.floor(weatherData.main.feels_like)}°C
                            </p>
                            <div className="flex items-center">
                                <h5 className="text-2xl font-semibold mr-2">
                                    {weatherData.name}
                                </h5>
                                <FaLocationDot />
                            </div>
                        </div>
                        <div className="flex_between mb-4">
                            <div className="flex_col">
                                <div className="flex items-center">
                                    <FaTemperatureHigh className="text-2xl" />
                                    <p className="_para ml-2">
                                        {Math.floor(weatherData.main.temp_max)}
                                        °C
                                    </p>
                                </div>
                                <p>Maximum</p>
                            </div>
                            <div className="flex_col">
                                <div className="flex items-center">
                                    <FaTemperatureLow className="text-2xl" />
                                    <p className="_para ml-2">
                                        {Math.floor(weatherData.main.temp_min)}
                                        °C
                                    </p>
                                </div>
                                <p>Minimum</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex_col">
                                <div className="flex items-center">
                                    <WiHumidity className="text-3xl" />
                                    <p className="_para ml-1">
                                        {weatherData.main.humidity}%
                                    </p>
                                </div>
                                <p>Humidity</p>
                            </div>
                            <div className="flex_col">
                                <div className="flex items-center">
                                    <FaWind className="text-xl" />
                                    <p className="_para ml-2">
                                        {Math.floor(
                                            3.6 * weatherData.wind.speed
                                        )}
                                        km/h
                                    </p>
                                </div>
                                <p>Wind Speed</p>
                            </div>
                        </div>
                    </div>
                )}
                {error === 404 && (
                    <div className="flex_center">
                        <p className="text-lg font-semibold my-6">
                            City not found!
                        </p>
                    </div>
                )}
                {error === 500 && (
                    <div className="flex_center">
                        <p className="text-lg font-semibold my-6">
                            Internal server error!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Home;
