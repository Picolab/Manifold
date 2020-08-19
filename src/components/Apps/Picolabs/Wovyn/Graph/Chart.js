import React, {Component} from 'react';
import { Line } from 'react-chartjs-2';

class Chart extends Component {
    state = { temperatures: [] }

    componentDidMount() {
        const temps = this.props.tempInfo.map(item => item.temperature)
        this.setState({temperatures: temps}, () => {
            console.log("Updated temperatures:", this.state.temperatures)
        })

        this.props.setAverageTemp(temps)
        this.props.setHighTemp(temps)
    }

    
    render() {
        let data = {
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], 
            datasets: [
            {
                label: 'Internal Closet Temperature',
                fill: true,
                lineTension: 0.1,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: this.state.temperatures
            }
            ],
        };

        return (
            <div>
                <Line 
                data={data} 
                width={600} 
                height={450}
                options={{
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 50,
                                suggestedMax: 90,
                                stepSize: 5
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                maxTicksLimit: 12,
                                
                            }
                        }]
                    }
                }}
                />
            </div>
        )
    }
}

export default Chart;