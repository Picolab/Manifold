import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Combobox } from 'react-input-enhancements';
import { connect } from 'react-redux';
import { removeFromCommunity, getCommunityThings } from '../../utils/manifoldSDK';
import PropTypes from 'prop-types';
import { getDID } from '../../reducers';

export class RemoveCommThingModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalOn: props.modalOn,
      things: {},
      thingOptions: [],
      value: "DEFAULT INPUT VAL",
      thingToRemove: ""
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentDidMount() {
    let promise = getCommunityThings(this.props.DID);

    promise.then((resp) => {
      let things = resp.data;
      let thingNameArray = Object.values(things).map((thing) => thing.dname);
      this.setState({ things: things, thingOptions: thingNameArray });
    });
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleRemove() {
    let toRemove = this.state.thingToRemove;
    if(!toRemove || toRemove === ""){
      alert("You must choose a thing to remove before you can perform this action!");
      return;
    }
    let thing = Object.values(this.state.things).filter((thing) => thing.dname === toRemove)[0];
    removeFromCommunity(this.props.DID, thing.id);
    this.handleToggle();
  }

  handleToggle() {
    this.setState({
      thingToRemove: ""
    })
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-danger'}>
        <ModalHeader toggle={this.handleToggle}>Remove a Thing</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> Select a thing to remove:</label>
                <Col xs={6}>
                  <Combobox defaultValue={this.state.value}
                            options={this.state.thingOptions}
                            onSelect={(element) => this.setState({ thingToRemove: element})}
                            autosize
                            autocomplete>
                    {(inputProps, { matchingText, width }) =>
                      <input {...inputProps} type='text' placeholder="Select THING" />
                    }
                  </Combobox>
                </Col>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={this.handleRemove}>Remove</Button>
          <Button color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

RemoveCommThingModal.propTypes = {
  //parent provides these
  picoID: PropTypes.string.isRequired,
  modalOn: PropTypes.bool.isRequired,
  toggleFunc: PropTypes.func.isRequired,
  //no need to provide the following
  //installRuleset: PropTypes.func.isRequired,
  DID: PropTypes.string.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoveCommThingModal)
