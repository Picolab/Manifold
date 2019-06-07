import React, { Component } from 'react';
import { retrieveOwnerProfile } from '../../../../utils/manifoldSDK';
//import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Label, Input, Media, ListGroup, ListGroupItem, Container, Row, Col } from 'reactstrap';
import DeleteButton from './DeleteButton';
import tag from './tag.png';
import './SafeAndMine.css';
const TAG_CHAR_LENGTH = 6;
const MAIN_MESSAGE_CHAR_LENGTH = 250;
const META_FIELD_CHAR_LENGTH = 100;

export class SafeAndMineCardView extends Component {

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
      const { name = "", email = "", phone = "", message = "", shareName = false, shareEmail = false, sharePhone = false } = resp.data;
      if(name === "" && email === "") {
        this.getProfileInfo();
      }
      else {
        this.setState({
          savedName: name,
          savedEmail: email,
          savedPhone: phone,
          savedMessage: message,
          shareName,
          sharePhone,
          shareEmail,
        })
      }
    }).catch((e) => {
      console.error("Error loading safeandmine information", e);
    })
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

  ownersName() {
    if (this.state.savedName) return this.state.savedName + "'s";
    else return "My";
  }

  displayTagList() {
    let toDisplay = [];
    this.state.registeredTags.forEach((tagID) => {
      toDisplay.push(
        <ListGroupItem key={tagID}>
          <Media object src={tag} className="tagImage"></Media>
          {"  " + tagID}
        </ListGroupItem>
      );
    })
    if (toDisplay.length == 0) return "Registerd Tags will appear here!"
    else return toDisplay;
  }

  render() {
    return(
      <div className="cardWidth">
        <h6>{this.ownersName()} Tags:</h6>
        <ListGroup className="cardWidth">
          {this.displayTagList()}
        </ListGroup>
      </div>
    )
  }
}

SafeAndMineCardView.propTypes = {
}

export default SafeAndMineCardView;
