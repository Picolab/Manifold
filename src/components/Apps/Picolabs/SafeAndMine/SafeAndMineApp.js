import React, { Component } from 'react';
import { retrieveOwnerProfile, retrieveOtherProfile } from '../../../../utils/manifoldSDK';
import SafeAndMineModal from './SafeAndMineModal';
//import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, Media, ListGroup, ListGroupItem, Container, Row, Col } from 'reactstrap';
import DeleteButton from './DeleteButton';
import tag from './tag.png';
import './SafeAndMine.css';
import queryString from 'query-string';
const TAG_CHAR_LENGTH = 6;
const MAIN_MESSAGE_CHAR_LENGTH = 250;
const META_FIELD_CHAR_LENGTH = 100;

export class SafeAndMineApp extends Component {

  constructor(props) {
    super(props);


    let params = (window.location.href.indexOf('?') !== -1) ? window.location.href.slice(window.location.href.indexOf('?') + 1) : "";
    let { tagID, domain } = (queryString.parse(params)) ? queryString.parse(params): " ";
    if (domain !== "sqtg" && domain !== "picolabs") domain = "picolabs";

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
      tagID: (tagID) ? tagID : "",
      other: {},
      domain,
      registeredTags: {},

      // component state

      messageLength: 0,
      validTagId: true
    }

    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.getOtherInfo = this.getOtherInfo.bind(this);
    this.registerTag = this.registerTag.bind(this);
    this.onChange = this.onChange.bind(this);
    this.retrieveInformation = this.retrieveInformation.bind(this);
    this.retrieveTags = this.retrieveTags.bind(this);
  }

  componentDidMount() {
    this.retrieveInformation();
    this.retrieveTags();
  }

  getProfileInfo() {
    const profileGetPromise = retrieveOwnerProfile();
    profileGetPromise.then((resp) => {
      const profile = resp.data;
      if (profile.google) {
        this.setState({
          profile: profile.google
        })
      } else if(profile.github) {
        this.setState({
          profile: profile.github
        })
      }
    }).catch((e) => {
      console.error(e);
    });

    this.getOtherInfo();
  }

  getOtherInfo() {
    const profileGetPromise = retrieveOtherProfile();
    profileGetPromise.then((resp) => {
      const profile = resp.data;
      if(profile.safeandmine) {
        this.setState({other: profile.safeandmine});
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  retrieveInformation() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.safeandmine",
      funcName: "getInformation"
    });

    promise.then((resp) => {
      const { name = "", email = "", phone = "", message = "", shareName = false, shareEmail = false, sharePhone = false } = resp.data;

      this.getProfileInfo();

        this.setState({
          savedName: name,
          savedEmail: email,
          savedPhone: phone,
          savedMessage: message,
          shareName,
          sharePhone,
          shareEmail,
          messageLength: message.length,
        })

    }).catch((e) => {
      console.error("Error loading safeandmine information", e);
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
    this.setState({validTagId: true})
    const promise = this.props.signalEvent({
      domain: "safeandmine",
      type: "new_tag",
      attrs: {
        tagID: this.state.tagID,
        domain: this.state.domain
      }
    });
    promise.then(() => {

      setTimeout(this.retrieveTags(), 500);
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


  displayDomain(domain, key) {
    let toDisplay = [];
    domain.forEach((tagID) => {
      toDisplay.push(
        <ListGroupItem key={tagID}>
          <Media object src={tag} className="tagImage"></Media>
          {"  " + tagID}
          <DeleteButton signalEvent={this.props.signalEvent} tagID={tagID} domain={key} retrieveTags={this.retrieveTags} />
        </ListGroupItem>
      );
    });
    return toDisplay;
  }

  displayTagList() {
    let toDisplay = [];
    //console.log("tags", this.state.registeredTags);
    for (var key in this.state.registeredTags) {
      toDisplay.push(
             <ListGroup key={key}>
              <ListGroupItem className="domain">{key}</ListGroupItem>
              {this.displayDomain(this.state.registeredTags[key], key)}
             </ListGroup>
         );
    }

    return toDisplay;
  }


  render() {
    return(
      <div className="shortenedWidth">
        <h1>Safe and Mine</h1>
          <h2 className="serviceHeader">My Information{' '}
          <SafeAndMineModal signalEvent={this.props.signalEvent} retrieveInformation={this.retrieveInformation} shareName={this.state.shareName} shareEmail={this.state.shareEmail} sharePhone={this.state.sharePhone} name={this.state.savedName ? this.state.savedName : (this.state.profile) ? this.state.profile.displayName : ""} message={this.state.savedMessage} profile={this.state.profile} other={this.state.other} update={this.updateData} />
          </h2>
          <br />
          <br />
        <ListGroup>
          {this.state.savedName && <ListGroupItem><b>Name:</b> {this.state.savedName}</ListGroupItem>}
          {this.state.savedEmail && <ListGroupItem><b>Email:</b> {this.state.savedEmail}</ListGroupItem>}
          {this.state.savedPhone && <ListGroupItem><b>Phone:</b> {this.state.savedPhone}</ListGroupItem>}
          {this.state.savedMessage && <ListGroupItem><b>Message:</b> {this.state.savedMessage}</ListGroupItem>}
        </ListGroup>

        <br></br><br></br>
        <h3>Registered Tags</h3>
          {this.displayTagList()}
        <br></br>
        <Form onSubmit={this.registerTag} className="shortenedWidth">
          <FormGroup>

            <Label for="Message">Enter a new TagID:</Label>

            <Container style={{margin:0, padding:0}}>
              <Row style={{margin:0, padding:0}}>
                <Col xs="10" style={{margin:0, padding:0}}>
                  <Input type="text" name="tagID" id="tagID" placeholder="ABCDEF" value={this.state.tagID} onChange={this.onChange('tagID')} />
                  {this.state.validTagId ? "" : <i style={{"color":"rgb(213, 99, 71)"}}> Tag ID must be at least {TAG_CHAR_LENGTH} characters</i>}
                </Col>
                <Col xs="2" style={{margin:0, padding:0}}>

                  <Input type="select" name="domain" id="domain" value={this.state.domain} onChange={this.onChange('domain')}>
                    <option>picolabs</option>
                    <option>sqtg</option>
                  </Input>
                </Col>
              </Row>
            </Container>

          </FormGroup>
          <Button>Register Tag</Button>
        </Form>
        <p className="shortenedWidth">Icon made by <a href="https://www.flaticon.com/authors/freepik">Freepik</a> from www.flaticon.com</p>
      </div>
    )
  }
}

SafeAndMineApp.propTypes = {
}

export default SafeAndMineApp;
