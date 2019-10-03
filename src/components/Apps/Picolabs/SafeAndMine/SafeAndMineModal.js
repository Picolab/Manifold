import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import { getOwnerECI } from '../../../../utils/AuthService';
import { customEvent, customQuery } from '../../../../utils/manifoldSDK';

class SafeAndMineModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      titleError: false,
      title: "safeandmine",
      phone: "",
      email: "",
      message: "",
      shareEmail: true,
      shareName: true,
      sharePhone: true,
      getTexts: true
    };

    this.toggle = this.toggle.bind(this);
    this.submitSection = this.submitSection.bind(this);
    this.updateData = this.updateData.bind(this);
    this.onCheck = this.onCheck.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      phone: (nextProps.other) ? ((nextProps.other.phone) ? nextProps.other.phone : "") : "",
      email: (nextProps.other) ? ((nextProps.other.email) ? nextProps.other.email : "") : "",
      message: nextProps.message,
      name: nextProps.name,
      shareName: nextProps.shareName,
      shareEmail: nextProps.shareEmail,
      sharePhone: nextProps.sharePhone
    });
  }

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }



  updateData() {
    console.log("state", this.state)
    let attrs = {
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      message: this.state.message,
      shareName: this.state.shareName,
      shareEmail: this.state.shareEmail,
      sharePhone: this.state.sharePhone

    };

    const promise = this.props.signalEvent({
      domain: "safeandmine",
      type: "update",
      attrs
    });
    promise.then(() => {
      this.props.retrieveInformation();
    }).catch((e) => {
      console.error(e);
    })

  }

  onCheck(stateKey) {
    return (event) => {
      this.setState({
        [stateKey]: !this.state[stateKey]
      })
    }
  }


  submitSection(e) {
    e.preventDefault();
    let available_title_promise = customQuery(getOwnerECI(), "io.picolabs.profile", "availableSection", {"section":this.state.title})

    available_title_promise.then((resp) => {
      if(resp.data) {
        let add_section_promise = customEvent( getOwnerECI(), "profile", "other_profile_save", {"section": this.state.title, "phone": this.state.phone, "email": "", "street": "", "city": "", "state": "", "postalcode": "", "favorite": this.state.getTexts}, "adding_section");
        add_section_promise.then((resp) => {
          this.setState({
            title: "",
            phone: "",
            email: "",
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

    this.updateData()
    this.toggle()
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value;

      this.setState({
        [stateKey]: value
      })
    }
  }

  render() {
    return (
      <span>
        <a className="edit-link" onClick={this.toggle}>Edit</a>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>{this.state.title}</ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup row>
                <Label for="Name" sm={4}>Name</Label>
                <Col sm={11}>
                  <Input type="text" name="name" id="name" placeholder="Name" value={this.state.name} onChange={this.onChange('name')}/>
                </Col>
                <Col sm={1}>
                <FormGroup check>
                  <div style={{marginTop: "7px"}}>
                    <Input type="checkbox" id="shareName" checked={this.state.shareName} onChange={this.onCheck('shareName')} style={{"float" : "right"}} />
                  </div>
                </FormGroup>
                </Col>
                <div style={{fontSize: "9px", marginLeft: "20px", marginRight: "50px"}}>By checking the box above, you agree to share your name with anyone who scans your tag.</div>
              </FormGroup>

              <FormGroup row>
                <Label for="email" sm={4}>Email</Label>
                <Col sm={11}>
                  <Input type="email" name="email" id="email" placeholder="Email" value={this.state.email} onChange={this.onChange('email')}/>
                </Col>
                <Col sm={1}>
                <FormGroup check>
                  <div style={{marginTop: "7px"}}>
                    <Input type="checkbox" id="shareEmail" onChange={this.onCheck('shareEmail')} checked={this.state.shareEmail} style={{"float" : "right"}} />
                  </div>
                </FormGroup>
                </Col>
                <div style={{fontSize: "9px", marginLeft: "20px", marginRight: "50px"}}>By checking the box above, you agree to share your email with anyone who scans your tag.</div>
              </FormGroup>


              <FormGroup row>
                <Label for="phone" sm={4}>Phone</Label>
                <Col sm={11}>
                  <Input type="phone" name="phone" id="phone" placeholder="Phone" value={this.state.phone} onChange={this.onChange('phone')}/>
                </Col>
                <Col sm={1}>
                <FormGroup check>
                  <div style={{marginTop: "7px"}}>
                    <Input type="checkbox" id="sharePhone" onChange={this.onCheck('sharePhone')} checked={this.state.sharePhone} style={{"float" : "right"}} />
                  </div>
                </FormGroup>
                </Col>
                <div style={{fontSize: "9px", marginLeft: "20px", marginRight: "50px"}}>By checking the box above, you agree to share your phone number with anyone who scans your tag.</div>
              </FormGroup>

              <Row>
              <Col sm={11}>
              <div>Check this box to receive text notifications when your safeandmine tag is scanned.</div>
              </Col>
              <Col sm={1}>
              <FormGroup check>
                <div style={{marginTop: "7px"}}>
                  <Input type="checkbox" id="getTexts" onChange={this.onCheck('getTexts')} checked={this.state.getTexts} style={{"float" : "right"}} />
                </div>
              </FormGroup>
              </Col>
              </Row>



              <FormGroup row>
                <Label for="message" sm={4}>Message</Label>
                <Col sm={12}>
                  <Input type="textarea" name="message" id="message" style={{height: "100px"}} placeholder="Thanks for finding my thing! Please return it." value={this.state.message} onChange={this.onChange('message')}/>
                </Col>
              </FormGroup>


            </Form>
            </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.submitSection}>Add</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </span>
    );
  }
}

export default SafeAndMineModal;
