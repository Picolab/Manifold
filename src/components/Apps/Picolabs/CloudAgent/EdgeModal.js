import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';

class EdgeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routerHost: this.props.routerHost,
      routerEci: this.props.routerEci,
      routerLabel: this.props.routerLabel,
      edgeModal: false
    };
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  submit() {
    const promise = this.props.signalEvent({
        domain:"wrangler",
        type:"install_rulesets_requested",
        attrs: {
          rids:"org.sovrin.edge",
          host: this.state.routerHost,
          eci: this.state.routerEci,
          label: this.state.routerLabel
        }
    })
    promise.then((resp) => {
      this.props.getEdgeUI();
    })
  }



  render() {
    return (
      <span style={{"width": "100%"}}>
        {this.props.button}
        <Modal isOpen={this.props.edgeModal}  className={this.props.className} backdrop={this.state.backdrop}>
          <ModalHeader >Configure Router</ModalHeader>
          <ModalBody>
            Router Host:
            <Input type="text" name="routerHost" id="routerHost" placeholder="router host" value={this.state.routerHost} className="edgeInput" onChange={this.onChange('routerHost')} />
            Router Eci:
            <Input type="text" name="routerEci" id="routerEci" placeholder="router eci" value={this.state.routerEci} className="edgeInput" onChange={this.onChange('routerEci')} />
            Router Label:
            <Input type="text" name="routerLabel" id="routerLabel" placeholder="router label" value={this.state.routerLabel} className="edgeInput" onChange={this.onChange('routerLabel')} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={()=> {this.submit(); this.props.edgeToggle();}}>Configure</Button>{' '}
            <Button color="secondary" onClick={this.props.edgeToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export default EdgeModal;
