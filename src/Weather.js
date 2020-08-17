import React, { useState, useEffect } from 'react'
import CityInput from './CityInput'
import Switch from 'react-switch'

function  Weather() {
    const [ city, setCity ] = useState("Pittsburgh")
    const [ weatherData, setWeatherData ] = useState({ name: "", country: "", description: "", iconUrl: "", temp: "", feels_like: "", humidity: ""})
    const [ unit, setUnit ] = useState("fahrenheit")

    useEffect(() => {
        async function fetchData() {
            try {
                const units = unit === "fahrenheit" ? "imperial" : "metric"
                let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&APPID=eef25c6c675856bee810c6ca5958c8ee`)
                let data = await res.json()
                if (data.cod === "404") {
                    res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=${units}&APPID=eef25c6c675856bee810c6ca5958c8ee`)
                    data = await res.json()
                }
                return data
            } catch {
                throw new Error("Error fetching data")
            }
        }
        
        function constructIconUrl(iconToken) {
            const iconUrl = `http://openweathermap.org/img/wn/${iconToken}@2x.png`
            return iconUrl
        }

        function parseData(data) {
            if (data.cod === "404") {
                return null
            }

            const { name, 
                sys: { country }, 
                weather: [{ description, icon }], 
                main: { temp, feels_like, humidity } 
            } = data

            const capitalizeFirstLetters = (input) => input.replace(/\b\w/g, letter => letter.toUpperCase())

            const descriptionFormatted = capitalizeFirstLetters(description)
            
            const iconUrl = constructIconUrl(icon)

            return { 
                name, 
                country, 
                description: descriptionFormatted, 
                iconUrl,
                temp, 
                feels_like, 
                humidity 
            }
        }

        async function fetchWeatherData() {
            const data = await fetchData()
            const parsedData = await parseData(data)
            setWeatherData(parsedData)
        }

        if (city) fetchWeatherData()
    }, [ city ])

    function handleCityInput(cityInput) {
        setCity(cityInput)
    }

    function handleUnitChange(switchValue) {

        function fahrenheitToCelsius(f) {
            return (f - 32) / 1.8
        }

        function celsiusToFahrenheit(c) {
            return c * 1.8 + 32
        }

        function nearestHundredth(num) {
            return Math.floor(num * 100) / 100
        }
        
        const newUnits = switchValue ? "celsius" : "fahrenheit"
        const newTemp = newUnits === "celsius" ? fahrenheitToCelsius(weatherData.temp) : celsiusToFahrenheit(weatherData.temp)
        const newTempRounded = nearestHundredth(newTemp)
        const newFeelsLike = newUnits === "celsius" ? fahrenheitToCelsius(weatherData.feels_like) : celsiusToFahrenheit(weatherData.feels_like)
        const newFeelsLikeRounded = nearestHundredth(newFeelsLike)
        
        setWeatherData({
            ...weatherData,
            temp: newTempRounded,
            feels_like: newFeelsLikeRounded
        })

        setUnit(newUnits)
    }
    
    if (weatherData) {
        const { name, country, description, iconUrl, temp, feels_like, humidity } = weatherData

        return (        
            <div>
                <CityInput handleCityInput={ handleCityInput } />
                <Switch 
                    onChange={ handleUnitChange } 
                    checked={ unit === "celsius" } 
                    offColor="#08f"
                    onColor="#08f"
                    uncheckedIcon={
                        <div
                            style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: 15,
                            color: "#fff",
                            paddingRight: 2
                            }}
                        >
                            &#8457;
                        </div>
                    }
                    checkedIcon={
                        <div
                            style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            fontSize: 15,
                            color: "#fff",
                            paddingRight: 2
                            }}
                        >
                            &#8451;
                        </div>
                    } 
                />
                <h3>{ name }, { country }</h3>
                <div>{ description }</div>
                <img src={ iconUrl } alt={ description } />
                <div> Current Temperature: { temp }</div>
                <div>Feels Like { feels_like }</div>
                <div style={{ margin: "15px" }}>Humidity: {humidity}%</div>
            </div>
        )
    } else {
        return (
            <div>
                <CityInput handleCityInput={ handleCityInput } />
                <div>City not found</div>
            </div>
        )
    }
}

export default Weather
