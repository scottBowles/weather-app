import React, { useState, useEffect } from 'react'
import CityInput from './CityInput'
import UnitSwitch from './UnitSwitch'
import WeatherDisplay from './WeatherDisplay'

function  Weather() {
    const [ city, setCity ] = useState("Pittsburgh")
    const [ weatherData, setWeatherData ] = useState()
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
            if (data.cod === "404" || data.cod === 429) {
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
    }, [ city, unit ])

    function handleCityInput(cityInput) {
        setCity(cityInput)
    }

    function handleUnitChange(switchValue) {        
        const newUnits = switchValue ? "celsius" : "fahrenheit"
        setUnit(newUnits)
    }
    
    return (        
        <div>
            <CityInput handleCityInput={ handleCityInput } />
            <UnitSwitch handleUnitChange={ handleUnitChange } unit={ unit } />
            <WeatherDisplay weatherData={ weatherData } />
        </div>
    )
}

export default Weather
