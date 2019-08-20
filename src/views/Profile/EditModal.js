import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { getOwnerECI } from '../../../src/utils/AuthService';
import { customEvent, customQuery } from '../../../src/utils/manifoldSDK';
import RemoveModal from './RemoveModal';
import './Profile.css';

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      title: this.props.sectionTitle,
      favorite: this.props.favorite,
      info: {}
    };

    this.editModalToggle = this.editModalToggle.bind(this);
    this.getSection = this.getSection.bind(this);
  }

  componentDidMount() {
    this.getSection()
  }

  componentWillReceiveProps(props) {
    this.setState({
      favorite: props.favorite
    })
  }

  editModalToggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  getSection() {
    let section = this.props.sectionTitle
    const sectionGetPromise = customQuery(getOwnerECI(),"io.picolabs.profile", "getSection", {"section": section});
    sectionGetPromise.then((resp) => {
      const info = resp.data
      if (info) {
        this.setState({
          phone: info.phone,
          email: info.email,
          street: info.street,
          city: info.city,
          state: info.state,
          postalcode: info.postalcode
        })
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  saveInputs = () => {
    this.removeSection()
    this.submitSection()
    this.editModalToggle()
    this.props.getOtherInfo()
  }

  remove = () => {
    this.removeSection()
    this.editModalToggle();
    this.props.getOtherInfo()
  }

  submitSection() {
    customEvent( getOwnerECI(), "profile", "other_profile_save", {"section": this.state.title, "phone": this.state.phone, "email": this.state.email, "street": this.state.street, "city": this.state.city, "state": this.state.state, "postalcode": this.state.postalcode, "favorite": this.state.favorite}, "adding_section");
  }

  removeSection() {
    customEvent( getOwnerECI(), "profile", "other_profile_remove", {"section": this.props.sectionTitle}, "removing_section");
  }

  render() {
    return (
      <span>
        <a className="edit-link" onClick={this.editModalToggle}>Edit</a>
        <Modal isOpen={this.state.modal} toggle={this.editModalToggle} className={this.props.className}>
          <ModalHeader toggle={this.editModalToggle}>{this.props.sectionTitle}</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label for="title" sm={4}>Section Title</Label>
                <Col sm={10}>
                  <Input type="title" name="title" id="title" placeholder="Title" value={this.state.title} onChange={this.onChange('title')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="phone" sm={4}>Phone</Label>
                <Col sm={10}>
                  <Input type="phone" name="phone" id="phone" placeholder="Phone" value={this.state.phone} onChange={this.onChange('phone')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="email" sm={4}>Email</Label>
                <Col sm={10}>
                  <Input type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.onChange('email')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="street" sm={4}>Street</Label>
                <Col sm={10}>
                  <Input type="street" name="street" id="street" placeholder="Street" value={this.state.street} onChange={this.onChange('street')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="city" sm={4}>City</Label>
                <Col sm={10}>
                  <Input type="city" name="city" id="city" placeholder="City" value={this.state.city} onChange={this.onChange('city')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="state" sm={4}>State</Label>
                <Col sm={10}>
                  <Input type="state" name="state" id="state" placeholder="State" value={this.state.state} onChange={this.onChange('state')}/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="postalcode" sm={4}>Postal Code</Label>
                <Col sm={10}>
                  <Input type="postalcode" name="postalcode" id="postalcode" placeholder="Postal Code" value={this.state.postalcode} onChange={this.onChange('postalcode')}/>
                </Col>
              </FormGroup>
            </Form>
            <RemoveModal sectionTitle={this.props.sectionTitle} editModalToggle={this.editModalToggle} getOtherInfo={this.props.getOtherInfo}/>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveInputs}>Save</Button>{' '}
            <Button color="secondary" onClick={this.editModalToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export default EditModal;
