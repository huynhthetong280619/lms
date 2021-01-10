import React from 'react'
import './overwrite.css'

class CountDownTest extends React.Component {

    render() {

        const {hours, minutes, seconds} = this.props;

        return (
            <div id="time">
                <div><span id="hour">{hours}</span><span>Hours</span></div>
                <div><span id="minute">{minutes}</span><span>Minutes</span></div>
                <div><span id="second">{seconds}</span><span>Seconds</span></div>
            </div>
        )
    }
}

export default CountDownTest