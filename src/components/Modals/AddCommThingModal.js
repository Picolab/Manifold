import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Combobox } from 'react-input-enhancements';
import { connect } from 'react-redux';
import { addToCommunity, getManifoldInfo, getCommunityThings } from '../../utils/manifoldSDK';
import PropTypes from 'prop-types';
import { getDID } from '../../reducers';

export class AddCommThingModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      modalOn: props.modalOn,
      things: {},
      thingOptions: [],
      value: "DEFAULT INPUT VAL",
      thingToAdd: ""
    };

    this.handleAdd = this.handleAdd.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }
  componentDidMount() {
    let manifoldPromise = getManifoldInfo();

    manifoldPromise.then((resp) => {
      let manifoldThings = resp.data.things;
      let manifoldThingNameArray = Object.values(manifoldThings).map((thing) => thing.name);

      let communityPromise = getCommunityThings(this.props.DID);
      communityPromise.then((resp) => {
        let communityThings = resp.data;
        let communityThingNameArray = Object.values(communityThings).map((thing) => thing.dname);

        let thingNameArray = manifoldThingNameArray.filter((manifoldThing) => !communityThingNameArray.includes(manifoldThing))
        this.setState({ things: manifoldThings, thingOptions: thingNameArray });
      });
    });
  }

  //this allows the modal to update its state when its props change
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      modalOn: nextProps.modalOn
    }
  }

  handleAdd() {
    let toAdd = this.state.thingToAdd;
    if(!toAdd || toAdd === ""){
      alert("You must choose a thing to add before you can perform this action!");
      return;
    }
    let thing = Object.values(this.state.things).filter((thing) => thing.name === toAdd)[0];
    addToCommunity(this.props.DID, thing.Tx);
    this.handleToggle();
  }

  handleToggle() {
    this.setState({
      thingToAdd: ""
    })
    this.props.toggleFunc();
  }

  render() {
    return (
      <Modal isOpen={this.state.modalOn} toggle={this.handleToggle} className={'modal-info'}>
        <ModalHeader toggle={this.handleToggle}>Add a Thing</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> Select a thing to install:</label>
                <Col xs={6}>
                  <Combobox defaultValue={this.state.value}
                            options={this.state.thingOptions}
                            onSelect={(element) => this.setState({ thingToAdd: element})}
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
          <Button color="info" onClick={this.handleAdd}>Add it</Button>
          <Button color="secondary" onClick={this.handleToggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

AddCommThingModal.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AddCommThingModal)
