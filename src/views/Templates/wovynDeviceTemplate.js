import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';

const brandPrimary =  '#20a8d8';
const brandSuccess =  '#4dbd74';
const brandInfo =     '#63c2de';
const brandDanger =   '#f86c6b';

class WovynDeviceTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    console.log("props",
      this.props
    );
    return (
      <div>
        <Chart
          chartType={this.props.chartType}
          rows={this.props.rows}
          columns={this.props.columns}
          graph_id={this.props.id}
          width={this.props.width}
          height={this.props.height}
          options={this.props.options}
        />
      </div>
    );
  }
}

WovynDeviceTemplate.propTypes = {
  chartType: PropTypes.string.isRequired,
  rows: PropTypes.arrayOf(PropTypes.array).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  id: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired
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
