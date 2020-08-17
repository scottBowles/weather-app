import React, { useState, useEffect } from 'react'
import CityInput from './CityInput'

function  Weather() {
    const [ city, setCity ] = useState("Pittsburgh")
    const [ weatherData, setWeatherData ] = useState({ name: "", country: "", description: "", iconUrl: "", temp: "", feels_like: "", humidity: ""})

    useEffect(() => {
        async function fetchData() {
            try {
                let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=eef25c6c675856bee810c6ca5958c8ee`)
                let data = await res.json()
                if (data.cod === "404") {
                    res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city},us&units=imperial&APPID=eef25c6c675856bee810c6ca5958c8ee`)
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
    
    if (weatherData) {
        const { name, country, description, iconUrl,temp, feels_like, humidity } = weatherData

        return (        
            <div>
                <CityInput handleCityInput={ handleCityInput } />
                <h3>{ name }, { country }</h3>
                <div>{ description }</div>
                <img src={ iconUrl } alt={ description } />
                <div> Current Temperature: { temp }</div>
                <div>Feels Like { feels_like }</div>
                <div>Humidity: {humidity}%</div>
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
