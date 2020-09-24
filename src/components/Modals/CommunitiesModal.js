import React, { Component } from 'react';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import { Combobox } from 'react-input-enhancements';
import { getDID } from '../../reducers';
import { connect } from 'react-redux';

export class CommunitiesModal extends Component {
  render() {
    return (
      <Modal isOpen={this.props.modalOn} className={'modal-info'}>
        <ModalHeader >Communities containing {this.props.name}</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label>Select a Thing or a Community to Add:</label>
                <Col xs={6}>
                  <Combobox defaultValue={"thing"}
                            options={["thing"]}
                            onSelect={()=>{}}
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
        </ModalFooter>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log("state", state)
  return {
    DID: getDID(state, ownProps.picoID)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunitiesModal)
