import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, FormText,Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { customEvent } from '../../utils/manifoldSDK';
import { Chart } from 'react-google-charts';

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
