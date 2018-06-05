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
        <div>
        Temperature gossip app!
        </div>
        <div style={{"height":"400px"}}>
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
        
        <button className="btn-primary" onClick={this.retrieveData}>
          Test promise
        </button>
        </div>
      </div>
    );
  }
}

NeighborhoodTemps.propTypes = {
  pico_id: PropTypes.string.isRequired,
  eci: PropTypes.string.isRequired
}

/*
CreateThingModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  createThing: PropTypes.func.isRequired
}
*/

const mapDispatchToProps = (dispatch) => {
  return {
    createThing: (name) => {
      //dispatch(commandAction(createThing, [name]))
    }
  }
}

//connect to redux store so we can get access to dispatch in the props
export default connect(null, mapDispatchToProps)(NeighborhoodTemps);
