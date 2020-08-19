import React from 'react'
import TimePicker from './TimePicker'
import DataCard from './DataCard'
import Chart from './Chart'
import './Graph.css'

class WovynGraph extends React.Component {

    state = { tempInfo : {}, isLoading : true, highTemp: null, avgTemp: null, threshold: 70 }

    componentDidMount() {
        const temps = this.props.manifoldQuery({
            rid: "io.picolabs.wovyn_temps",
            funcName: "getTemps"
        })
        temps.then(
            (res) => {
            console.log(res.data)
            this.setState({ tempInfo: res.data, isLoading: false })
        },
        (error) => {
            console.log(error)
        })
    }

    setAverageTemp = (childData) => {
        let averageFunc = (array) => array.reduce((a, b) => a + b) / array.length
        const averageTemp = averageFunc(childData)
        this.setState({ avgTemp: averageTemp}, () => {
            console.log('State avg', this.state.avgTemp)
        })
    }

    setHighTemp = childData => {
        let currentHigh = childData[0]

        for (var i = 1; i < childData.length; i++) {
            if (childData[i] > currentHigh) {
                currentHigh = childData[i]
            }
        }

        this.setState({ highTemp: currentHigh}, () => {
            console.log('State high', this.state.highTemp)
        })
    }

    render() {
        if (this.state.isLoading) {
            return null
        }
        else if (this.state.tempInfo === null) {
            return <div>No temperatures recorded in this Pico yet. Please configure it with a Wovyn device first.</div>
        }
        else {
            return (
                <div>
                    <div className="time-picker">
                        <TimePicker />
                    </div>
                    <div className="home-container">
                        <div className="graph-content">
                            <Chart tempInfo={this.state.tempInfo} setAverageTemp={this.setAverageTemp} setHighTemp={this.setHighTemp} />
                            <div className="chart-info">
                                <div className="threshold-container">
                                    <div>
                                        {`Current Threshold Temperature: ${this.state.threshold}°F`}
                                    </div>
                                    <div>
                                        Update Threshold Temperature: 
                                        <input type="number" id="quantity" name="quantity" min={`${this.state.threshold}` - 5} max="80"></input>
                                    </div>
                                    <div>
                                        <button type="button">Update</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-content">
                            <DataCard term="Average Temperature" avgTemp={this.state.avgTemp} />
                            <DataCard term="Highest Temperature" highTemp={this.state.highTemp} />
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default WovynGraph
 