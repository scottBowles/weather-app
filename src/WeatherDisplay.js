import React from 'react'

function WeatherDisplay(props) {
    const { name, country, description, iconUrl, temp, feels_like, humidity } = props.weatherData
    return (
        <>
            <h3>{ name }, { country }</h3>
            <div>{ description }</div>
            <img src={ iconUrl } alt={ description } />
            <div> Current Temperature: { temp }</div>
            <div>Feels Like { feels_like }</div>
            <div style={{ margin: "15px" }}>Humidity: {humidity}%</div>
        </>
    )
}

export default WeatherDisplay