import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Chart } from 'react-google-charts';

class WovynDeviceTemplate extends Component {
  render(){
    console.log("props",
      this.props
    );
    return (
      <div>
        <Chart
          chartType="LineChart"
          rows={[
            [1, 1],
            [2, 2],
            [3, 3],
            [4, 5],
            [5, 6],
            [8, 9],
          ]}
          columns={[{"label":"Age","type":"number"},{"label":"Weight","type":"number"}]}
          graph_id="LineChart"
          width="100%"
          height="100px"
          options={{
            title: 'Age vs. Weight comparison',
            hAxis: { title: 'Age', minValue: 0, maxValue: 15 },
            vAxis: { title: 'Weight', minValue: 0, maxValue: 15 },
            legend: 'none',
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  if(state.identities){
    return {
       identities: state.identities
    }
  }else{
    return {}
  }
}

export default connect(mapStateToProps)(WovynDeviceTemplate);
