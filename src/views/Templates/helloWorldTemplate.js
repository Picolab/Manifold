import React, { Component } from 'react';
import { Form, FormGroup, Label, Input, FormText,Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { connect } from 'react-redux';
import _ from 'lodash';
import { customEvent } from '../../utils/manifoldSDK';

class HelloWorldTemplate extends Component {
  constructor(props) {
    super(props);

  }



  render(){
    return (
      <div>
        HELLO WORLDZY
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

export default connect(mapStateToProps)(HelloWorldTemplate);
