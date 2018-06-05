import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sky_event } from '../../utils/manifoldSDK';
import { connect } from 'react-redux';
import { commandAction } from '../../actions/command';
import {Chart} from 'react-google-charts';

class NeighborhoodTemps extends Component {
  constructor(props){
    super(props);
    console.log(props);
    this.state = {
       temps: props.bindings.temps,
       tempsKeys: Object.keys(props.bindings.temps)
    }
    this.retrieveData();
    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    let intervalID = setInterval(this.retrieveData, 5000);
    this.setState({intervalID})
  }
  
  componentWillUnmount() {
    clearInterval(this.state.intervalID)
  }

  retrieveData() {
    let queryPromise = this.props.manifoldQuery({
      rid: "io.picolabs.neighborhood_temps",
      funcName: "get_report",
      funcArgs: [

      ]
    })
    queryPromise.then(result => {
      console.log("queryPromise result:", result)
      this.setState({
        temps: result.data,
        tempsKeys: Object.keys(result.data)
      })
    }).catch(error => {
        console.error(error);
    })

  }

  averageComponent() {
    let temps = this.state.temps;
    let avgArray = [];
    Object.keys(temps).forEach((key) => {
      let sum = temps[key].reduce((a,b) => {
        return a+b.temperature;
      }, 0); 
      let avg = sum / (temps[key].length == 0 ? 1 : temps[key].length);
      avgArray.push(<tr key={key}>
                      <td>{key}</td>
                      <td>{avg.toFixed(2)}</td>
                    </tr>);
    })
    return (<table className="table" style={{"padding":"15px 15px 15px 15px"}}>
        <thead>
          <tr>
            <th scope="col">Sensor Name</th>
            <th scope="col">Average Temperature °F</th>
          </tr>
        </thead>
        <tbody>
          {avgArray}
        </tbody>
      </table>
    )
  }

  generateRowsArray() {
    let rowsArray = [];
    let tempsKeys = this.state.tempsKeys;
    console.log(this.state.temps);
    tempsKeys.forEach((sensorName, index) => {
      this.state.temps[sensorName].forEach((tempLog) => {
        let newRow = new Array(tempsKeys.length + 1).fill(null);
        let date = new Date(tempLog.timestamp);
        newRow[0] = [date.getHours(), date.getMinutes(), date.getSeconds()];
        newRow[index + 1] = tempLog.temperature;
        rowsArray.push(newRow);
      })
    });
    rowsArray.sort((a, b) => {
      let time1 = a[0]; // time1 and time2 are arrays of [hours, minutes, seconds]
      let time2 = b[0];
      for (let i = 0; i < a[0].length; i++) {
      if (time1[i] > time2[i])
        return 1
      if (time2[i] > time1[i])
        return -1;
      }
      return 0;
    });
    console.log(rowsArray);
    return rowsArray;
  }

  generateColumnsArray() {
    let columnsArray = [];
    columnsArray.push({"label":"Time","type":"timeofday"}); // x axis
    let tempsKeys = this.state.tempsKeys;
    tempsKeys.forEach((sensorName, index) => {
      columnsArray.push({
        label:sensorName,
        type:"number"
      })
    })
  
    return columnsArray;
  }

  render(){
    if (this.state.temps == null)
      return (<div> loading... </div>)
    return (
      <div>
        <h2 style={{"margin":"auto", "textAlign":"center","paddingBottom":"5px"}}>Neighborhood Temps</h2>
        <div style={{"height":"400px","paddingBottom":"40px"}}>
          <Chart
            chartType="LineChart"
            rows={this.generateRowsArray()}
            columns={this.generateColumnsArray()}
            graph_id={this.props.eci}
            width="100%"
            height="inherit"
            options={{
              title: 'Neighborhood Temperatures',
              hAxis: { title: 'Time'},
              vAxis: { title: 'Temperature (F)'},
              interpolateNulls: true,
              curveType:'function'
            }}
          />
        </div>
        <div>
          {this.averageComponent()}
        </div>
      </div>
    );
  }
}

NeighborhoodTemps.propTypes = {
  pico_id: PropTypes.string.isRequired,
  eci: PropTypes.string.isRequired
}

export default NeighborhoodTemps;
