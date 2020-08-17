import React from 'react'
import Switch from 'react-switch'

function UnitSwitch(props) {
    return (
        <Switch 
            onChange={ props.handleUnitChange } 
            checked={ props.unit === "celsius" } 
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
    )
}

export default UnitSwitch