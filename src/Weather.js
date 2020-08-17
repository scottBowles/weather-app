import React, { useState, useEffect } from 'react'

function  Weather() {
    const [ city, setCity ] = useState("Pittsburgh")
    const [ weatherData, setWeatherData ] = useState({ name: "", country: "", main: "", description: "", icon: "", temp: "", feels_like: "", humidity: ""})
    const [ weatherIconUrl, setWeatherIconUrl ] = useState('')

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=eef25c6c675856bee810c6ca5958c8ee`)
            const data = await res.json()
            return data
        }

        function parseData(data) {
            const { name, 
                sys: { country }, 
                weather: [{ main, description, icon }], 
                main: { temp, feels_like, humidity } 
            } = data

            return { 
                name, 
                country, 
                main, 
                description, 
                icon,
                temp, 
                feels_like, 
                humidity 
            }
        }

        function constructIconUrl(iconToken) {
            const iconUrl = `http://openweathermap.org/img/wn/${iconToken}@2x.png`
            return iconUrl
        }

        async function fetchWeatherData() {
            const data = await fetchData()
            const parsedData = await parseData(data)
            const iconUrl = constructIconUrl(parsedData.icon)
            setWeatherData(parsedData)
            setWeatherIconUrl(iconUrl)
        }

        fetchWeatherData()
    }, [ city ])
    
    return (
        <div>
            <div>{ weatherData.main }</div>
            <div> Current Temperature: { weatherData.temp }</div>
            <img src={ weatherIconUrl } alt={ weatherData.description } />
        </div>
    )
}

export default Weather
