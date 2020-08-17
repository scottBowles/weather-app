import React, { useState } from 'react'

function CityInput(props) {
    const [ city, setCity ] = useState("")

    function handleChange(event) {
        const { value } = event.target
        setCity(value)
    }

    function handleSubmit(event) {
        event.preventDefault()
        props.handleCityInput(city)    
    }

    return (
        <form onSubmit={ handleSubmit }>
            <input type="text" placeholder="City" value={ city } onChange={ handleChange }></input>
            <button>Search</button>
        </form>
    )
}

export default CityInput