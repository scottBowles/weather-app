import React, { useState, useEffect } from 'react'
import CityInput from './CityInput'

function  Weather() {
    const [ city, setCity ] = useState("")
    const [ weatherData, setWeatherData ] = useState({ name: "", country: "", main: "", description: "", iconUrl: "", temp: "", feels_like: "", humidity: ""})

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=eef25c6c675856bee810c6ca5958c8ee`)
            const data = await res.json()
            return data
        }
        
        function constructIconUrl(iconToken) {
            const iconUrl = `http://openweathermap.org/img/wn/${iconToken}@2x.png`
            return iconUrl
        }

        function parseData(data) {
            const { name, 
                sys: { country }, 
                weather: [{ main, description, icon }], 
                main: { temp, feels_like, humidity } 
            } = data

            const iconUrl = constructIconUrl(icon)

            return { 
                name, 
                country, 
                main, 
                description, 
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
    
    return (
        <div>
            <CityInput handleCityInput={ handleCityInput } />
            <div>{ weatherData.main }</div>
            <div> Current Temperature: { weatherData.temp }</div>
            <img src={ weatherData.iconUrl } alt={ weatherData.description } />
        </div>
    )
}

export default Weather
