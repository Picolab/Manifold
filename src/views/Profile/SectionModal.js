import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { getOwnerECI } from '../../../src/utils/AuthService';
import { customEvent, customQuery } from '../../../src/utils/manifoldSDK';

class SectionModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      titleError: false
    };

    this.toggle = this.toggle.bind(this);
    this.submitSection = this.submitSection.bind(this);
  }

  toggle() {
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

  saveInputs = () => {
    this.submitSection()
  }

  submitSection() {
    let available_title_promise = customQuery(getOwnerECI(), "io.picolabs.profile", "availableSection", {"section":this.state.title})
    available_title_promise.then((resp) => {
      if(resp.data) {
        let add_section_promise = customEvent( getOwnerECI(), "profile", "other_profile_save", {"section": this.state.title, "phone": this.state.phone, "email": this.state.email, "street": this.state.street, "city": this.state.city, "state": this.state.state, "postalcode": this.state.postalcode, "favorite": false}, "adding_section");
        add_section_promise.then((resp) => {
          this.setState({
            title: "",
            phone: "",
            email: "",
            street: "",
            city: "",
            state: "",
            postalcode: "",
            titleError: false
          });
        })
        this.toggle()
        this.props.getOtherInfo();
      }
      else {
        this.setState({
          titleError: true
        })
      }
    })
  }

  render() {
    return (
      <div>
        <Button color="primary" onClick={this.toggle}>
          <i className="fa fa-plus-circle" aria-hidden="true"></i>
          {' '}Add Contact</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>New Section</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label for="title" sm={4}>Section Title</Label>
                <Col sm={10}>
                  {(this.state.titleError === true) ? <Input type="title" name="title" id="title" placeholder="Title" value={this.state.title} onChange={this.onChange('title')} className="invalid"/> : <Input type="title" name="title" id="title" placeholder="Title" value={this.state.title} onChange={this.onChange('title')}/>}
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
            {this.state.titleError === true && <div style={{"color": "red"}}>*Section Title already in use</div>}
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.saveInputs}>Add</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default SectionModal;
