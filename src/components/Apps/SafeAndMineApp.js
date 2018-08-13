import React, { Component } from 'react';
//import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, Media, ListGroup, ListGroupItem, Container, Row, Col } from 'reactstrap';
import DeleteButton from './DeleteButton';
import tag from './tag.png';
import './SafeAndMine.css';
const TAG_CHAR_LENGTH = 6;
const MAIN_MESSAGE_CHAR_LENGTH = 250;
const META_FIELD_CHAR_LENGTH = 100;

export class SafeAndMineApp extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      phone: "",
      message: "",
      savedName: "",
      savedEmail: "",
      savedPhone: "",
      savedMessage: "",
      shareName: false,
      shareEmail: false,
      sharePhone: false,


      tagID: "",
      registeredTags: [],

      // component state

      messageLength: 0,
      validTagId: true
    }

    this.updateData = this.updateData.bind(this);
    this.registerTag = this.registerTag.bind(this);
    this.onChange = this.onChange.bind(this);
    this.retrieveInformation = this.retrieveInformation.bind(this);
    this.retrieveTags = this.retrieveTags.bind(this);
  }

  componentDidMount() {
    this.retrieveInformation();
    this.retrieveTags();
  }

  retrieveInformation() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.safeandmine",
      funcName: "getInformation"
    });

    promise.then((resp) => {
      const { name = "", email = "", phone = "", message = "", shareName = false, shareEmail = false, sharePhone = false} = resp.data;
      this.setState({
        savedName: name,
        savedEmail: email,
        savedPhone: phone,
        savedMessage: message,
        shareName,
        sharePhone,
        shareEmail,
      })
    }).catch((e) => {
      console.error("Error loading safeandmine information", e);
    })
  }

  updateData(e) {
    e.preventDefault();
    const state = this.state;
    let attrs = {};
    for(var key in state) {
      const value = state[key];
      if(value) {//and any other checks
        attrs[key] = value;
      }
    }

    const promise = this.props.signalEvent({
      domain: "safeandmine",
      type: "update",
      attrs
    });
    promise.then(() => {
      this.retrieveInformation();
    }).catch((e) => {
      console.error(e);
    })

    this.setState({
      name : "",
      email: "",
      phone: "",
      message: ""
    })
  }

  setTextEditable(stateKey, stateKey2) {
  if (this.state[stateKey] === "") {
    return (event) => {
      this.setState({
        [stateKey]: stateKey2
      })
    }
  }

  else {
    return () => {}
  }
  }

  retrieveTags() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.safeandmine",
      funcName: "getTags"
    });
    promise.then((resp) => {
      this.setState({
        registeredTags: resp.data
      })
    }).catch((e) => {
      console.error(e);
    });
  }

  registerTag(e) {
    e.preventDefault();
    if (this.state.tagID.length !== TAG_CHAR_LENGTH) {
      this.setState({
        validTagId: false
      })
      return;
    }
    this.setState({validTagId: true})
    const promise = this.props.signalEvent({
      domain: "safeandmine",
      type: "new_tag",
      attrs: {
        tagID: this.state.tagID
      }
    });
    promise.then(() => {
      this.retrieveTags();
    }).catch((e) => {
      console.error(e);
    })

    this.setState({
      tagID : ""
    })
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      if (stateKey === "message") {
        if (value.length > MAIN_MESSAGE_CHAR_LENGTH)
          value = this.state.message  
        else
          this.setState({messageLength: value.length})
      } else if (event.target.value.length > META_FIELD_CHAR_LENGTH) {
        value = this.state[stateKey]
      }
      this.setState({
        [stateKey]: value
      })
    }
  }

  onCheck(stateKey) {
    return (event) => {
      this.setState({
        [stateKey]: !this.state[stateKey]
      })
    }
  }


  displayTagList() {
    let toDisplay = [];
    this.state.registeredTags.forEach((tagID) => {
      toDisplay.push(
        <ListGroupItem key={tagID}>
          <Media object src={tag} className="tagImage"></Media>
          {"  " + tagID}
          <DeleteButton signalEvent={this.props.signalEvent} tagID={tagID} retrieveTags={this.retrieveTags} />
        </ListGroupItem>
      );
    })
    return toDisplay;
  }

  render() {
    return(
      <div>
        <h1>Safe and Mine</h1>
        <p className="shortenedWidth">Use safe and mine to help find lost things! Attach a tag to anything you want to keep safe. If you lose that item and some good samaritan scans the tag, they will see a custom message just from you. You have the option to provide your name, phone number, email, and a custom message in any combination. If you dont want to provide a piece, no problem! Just share what you feel comfortable giving out to whoever finds your thing. You can modify these below. Modifying a piece of information will immediately alter the view that those who scan tags will see.</p>

        <br></br>

        <h2>My Information</h2>

        <ListGroup className="shortenedWidth">
          <Form onSubmit={this.updateData}>
            <ListGroupItem className="lessPadding">
              <Container>
                <Row>
                  <Col xs="2">
                    <b>Name:</b>
                  </Col>
                  <Col xs="8">
                    <FormGroup>
                      <Input className="greenPlaceholder noOutline" type="text" name="name" id="Name" placeholder={this.state.savedName} onClick={this.setTextEditable('name', this.state.savedName)} value={this.state.name} onChange={this.onChange('name')} />
                    </FormGroup>
                  </Col>
                  <Col xs="2">
                    <FormGroup check>
                        <Input type="checkbox" id="shareName" checked={this.state.shareName} onChange={this.onCheck('shareName')} style={{"float" : "right"}} />
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </ListGroupItem>


            <ListGroupItem className="lessPadding">
              <Container>
                <Row>
                  <Col xs="2">
                    <b>Email:</b>
                  </Col>
                  <Col xs="8">
                    <FormGroup>
                      <Input className="greenPlaceholder noOutline" type="text" name="email" id="Email" placeholder={this.state.savedEmail} onClick={this.setTextEditable('email', this.state.savedEmail)} value={this.state.email} onChange={this.onChange('email')} />
                    </FormGroup>
                  </Col>
                  <Col xs="2">
                    <FormGroup check>
                        <Input type="checkbox" id="shareEmail" checked={this.state.shareEmail} onChange={this.onCheck('shareEmail')} style={{"float" : "right"}} />
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </ListGroupItem>

            <ListGroupItem className="lessPadding">
              <Container>
                <Row>
                  <Col xs="2">
                    <b>Phone:</b>
                  </Col>
                  <Col xs="8">
                    <FormGroup>
                      <Input className="greenPlaceholder noOutline" type="text" name="phone" id="Phone" placeholder={this.state.savedPhone} onClick={this.setTextEditable('phone', this.state.savedPhone)} value={this.state.phone} onChange={this.onChange('phone')} />
                    </FormGroup>
                  </Col>
                  <Col xs="2">
                    <FormGroup check>
                        <Input type="checkbox" id="sharePhone" checked={this.state.sharePhone} onChange={this.onCheck('sharePhone')} style={{"float" : "right"}} />
                    </FormGroup>
                  </Col>
                </Row>
              </Container>
            </ListGroupItem>

            <ListGroupItem>
              <Container>
                <Row>
                  <Col xs="2">
                    <b>Message:</b>
                  </Col>
                  <Col xs="12">
                    <FormGroup>
                      <Input className="greenPlaceholder" type="textarea" name="message" id="Message" style={{height: '150px'}} placeholder={this.state.savedMessage} onClick={this.setTextEditable('message', this.state.savedMessage)} value={this.state.message} onChange={this.onChange('message')} />
                    </FormGroup>
                    <p style={{"fontSize": 12}}> {this.state.messageLength}/{MAIN_MESSAGE_CHAR_LENGTH} characters </p>
                  </Col>
                </Row>
              </Container>
              <p style={{"fontSize" : 10, "marginLeft" : 15, "marginRight" : 3}}>Checking the boxes next to your information shares that information with anyone who scans your tag.</p>
            </ListGroupItem>
            <br></br>
            <Button color="primary" style={{"float" : "right"}}>Save</Button>
          </Form>
        </ListGroup>

        <br></br><br></br>
        <h3>Registered Tags</h3>
        <ListGroup className="shortenedWidth">
          {this.displayTagList()}
        </ListGroup>
        <br></br>
        <Form onSubmit={this.registerTag} className="shortenedWidth">
          <FormGroup>
            <Label for="Message">Enter New TagID</Label>
            <Input type="text" name="tagID" id="tagID" placeholder="ABCDEF" value={this.state.tagID} onChange={this.onChange('tagID')} />
            {this.state.validTagId ? "" : <i style={{"color":"rgb(213, 99, 71)"}}> Tag ID must be {TAG_CHAR_LENGTH} characters</i>}
          </FormGroup>
          <Button>Register Tag</Button>
        </Form>
      </div>
    )
  }
}

SafeAndMineApp.propTypes = {
}

export default SafeAndMineApp;
