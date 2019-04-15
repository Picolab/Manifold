import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Media } from 'reactstrap';
import { retrieveOwnerProfile } from '../../../../utils/manifoldSDK';


class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayName: "No User Found",
      imgURL: "",
      message: ""
    };
    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  componentDidMount() {
    this.getProfileInfo();
    this.myVar = setInterval(() => this.refreshMessage(), 3000);
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
  }

  componentWillUnmount() {
    clearInterval(this.myVar);
  }

  component

  getProfileInfo() {
    const profileGetPromise = retrieveOwnerProfile();
    profileGetPromise.then((resp) => {
      const profile = resp.data;
      if (profile.google) {
        this.setState({
          displayName: profile.google.displayName,
          imgURL: profile.google.profileImgURL
        })
      } else if(profile.github) {
        this.setState({
          displayName: profile.github.displayName,
          imgURL: profile.github.profileImgURL
        })
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  displayMessages() {
    var output = [];
    for(var item in this.props.messages){
      if(this.props.messages[item]['from'] === 'incoming') {
        output.push(
          <div key={this.props.messages[item]['sent_time']}>
            <div className="received">
              {this.props.connectionImage}
              <p>{this.props.messages[item]['content']}</p>
            </div>
            <br />
          </div>
        );
      }
      else {
        output.push(
          <div key={this.props.messages[item]['sent_time']}>
            <div className="sent">
              <Media object src={this.state.imgURL} className="profilePic"/>
              <p>{this.props.messages[item]['content']}</p>
            </div>
            <br />
          </div>
        );
      }
    }
    this.scrollToBottom();
    return output;
  }

  sendMessage() {
    const promise = this.props.signalEvent({
      domain : "sovrin",
      type: "send_basicmessage",
      attrs : {
        their_vk: this.props.their_vk,
        content: this.state.message
      }
    });
    promise.then((resp) => {
      this.props.getUI();
      this.setState({
        message: ""
      });
    })
  }

  refreshMessage() {
    this.props.getUI();
  }

  scrollToBottom() {
    var element = document.getElementById("chatBody");
    if(element !== null) {
      element.scrollTop = element.scrollHeight;
    }
  }

  render() {
    return (
      <div>
        <div id="chatBody" className="chatBody">
          {this.displayMessages()}
        </div>
        <InputGroup>
          <Input type="text" name="message" placeholder="Send Message" value={this.state.message} onChange={this.onChange('message')}/>
          <InputGroupAddon addonType="append">
            <Button onClick={this.sendMessage} color="secondary">Send</Button>
          </InputGroupAddon>
         </InputGroup>
       </div>
    );
  }
}
export default Chat;
