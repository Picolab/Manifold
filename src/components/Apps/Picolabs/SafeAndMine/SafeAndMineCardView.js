import React, { Component } from 'react';
import { retrieveOwnerProfile } from '../../../../utils/manifoldSDK';
//import PropTypes from 'prop-types';
import { Media, ListGroup, ListGroupItem } from 'reactstrap';
import tag from './tag.png';
import './SafeAndMine.css';
const TAG_CHAR_LENGTH = 6;
const MAIN_MESSAGE_CHAR_LENGTH = 250;
const META_FIELD_CHAR_LENGTH = 100;

export class SafeAndMineAppCardView extends Component {

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
      domain: "",
      registeredTags: {},

      // component state

      messageLength: 0,
      validTagId: true
    }

    this.getProfileInfo = this.getProfileInfo.bind(this);
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

  getProfileInfo() {
    const profileGetPromise = retrieveOwnerProfile();
    profileGetPromise.then((resp) => {
      const profile = resp.data;
      console.log(resp.data);
      if (profile.google) {
        this.setState({
          name: profile.google.displayName,
          email: profile.google.email
        })
      } else if(profile.github) {
        this.setState({
          name: profile.github.displayName,
          email: profile.google.email
        })
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
          messageLength: message.length,
        })
      }
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
        validTagId: true
      })
      return;
    }
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
      this.retrieveTags();
    }).catch((e) => {
      console.error(e);
    })

    this.setState({
      tagID : "",
      domain: ""
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

  displayDomain(domain, key) {
    let toDisplay = [];
    domain.forEach((tagID) => {
      toDisplay.push(
        <ListGroupItem key={tagID}>
          <Media object src={tag} className="tagImage"></Media>
          {"  " + tagID}

        </ListGroupItem>
      );
    });
    return toDisplay;
  }

  displayTagList() {
    let toDisplay = [];
    if(this.state.registeredTags === null) return;
    //console.log("tags", this.state.registeredTags.keys());
    if(Object.keys(this.state.registeredTags).length > 0) {
      for (var key in this.state.registeredTags) {
        toDisplay.push(
               <ListGroup>
                <ListGroupItem className="domain" key={key}>{key}</ListGroupItem>
                {this.displayDomain(this.state.registeredTags[key], key)}
               </ListGroup>
           );
      }
    }
    else {
      toDisplay.push(<p>You currently have no registered tags. Open up this card to register new tags!</p>)
    }

    return toDisplay;
  }

  render() {
    return(
      <div>
        <h3>My Tags</h3>
          {this.displayTagList()}
      </div>
    )
  }
}

SafeAndMineAppCardView.propTypes = {
}

export default SafeAndMineAppCardView;
