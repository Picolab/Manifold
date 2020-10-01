import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Combobox } from 'react-input-enhancements';
import { getDID, getThings, getCommunities } from '../../reducers';
import { addToCommunity } from '../../utils/manifoldSDK';
import { connect } from 'react-redux';

export class CommunitiesModal extends Component {
  componentDidMount() {
      this.getThingsNames();
      this.getCommunitiesNames();
  }

  getCommunitiesNames = () => {
    this.props.communities.forEach((v, k) => {
      this.names.push(`${v.get("name")}:${v.get("Tx")}:${v.get("picoID")}`);
    });
  }

  getThingsNames = () => {
    this.names = [];
    this.props.things.forEach((v, k) => {
      this.names.push(`${v.get("name")}:${v.get("Tx")}:${v.get("picoID")}`);
    });
  }

  render() {
    return (
      <Modal isOpen={this.props.modalOn} className={'modal-info'}>
        <ModalHeader >Communities containing {this.props.name}</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Select a Thing or a Community to Add:</label>
                <Col xs={6}>
                  <Combobox defaultValue={"thing"}
                            options={(this.names) ? this.names : []}
                            onSelect={(selected) => {this.setState({addEci: selected.split(':')[1], addPicoID: selected.split(':')[2]})}}
                            autosize
                            autocomplete>
                    {(inputProps, { matchingText, width }) =>
                      <input {...inputProps} type='text' placeholder="Select APP" />
                    }
                  </Combobox>
                </Col>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={this.props.toggleFunc}>Close</Button>
          <Button color="primary" onClick={()=>{ this.props.addToCommunity(this.props.DID, this.state.addEci, this.state.addPicoID); this.props.toggleFunc(); }}>Add</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    DID: getDID(state, ownProps.picoID),
    things: getThings(state),
    communities: getCommunities(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToCommunity
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunitiesModal)
