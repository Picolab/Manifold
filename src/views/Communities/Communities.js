import React, { Component } from 'react';
import { createThing } from '../../utils/manifoldSDK';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Communities extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div>
        Communities Page
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {}
}


export default connect(mapStateToProps)(Communities);
