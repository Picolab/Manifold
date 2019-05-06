import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Media} from 'reactstrap';
import { retrieveOwnerProfile } from '../../../../utils/manifoldSDK';
import messageFailure from './failedmessage.png';


class Chat extends React.Component {
  constructor(props) {
    super(props);
    let failedMessage = localStorage.getItem('failedMessage'.concat(this.props.theirDID));
    this.state = {
      displayName: "No User Found",
      imgURL: "",
      message: "",
      myImage: <svg className="profilePic" data-jdenticon-value={this.props.myName}></svg>,
      agentImage: <svg className="connectionPic" data-jdenticon-value={this.props.title}></svg>,
      failedMessage: failedMessage === null | failedMessage === 'null' ? "" : failedMessage
    };
    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.reSendMessage = this.reSendMessage.bind(this);
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
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
  }

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

  getLastMessageStatus() {
    console.log("status check!");
    const promise = this.props.manifoldQuery({
      rid: "org.sovrin.manifold_agent",
      funcName: "lastMessageStatus"
    }).catch((e) => {
        console.error("Error getting message status", e);
    });
    promise.then((resp) => {
      if(resp.data["status"] === "pending") {
        if(this.statusCheck === undefined || this.statusCheck === null) {
            this.statusCheck = setInterval(() => this.getLastMessageStatus(), 500);
        }
      }
      else if(resp.data["status"] === "failed") {
        if(this.statusCheck !== undefined) {
            clearInterval(this.statusCheck);
            this.statusCheck = undefined;
        }
        localStorage.setItem('failedMessage'.concat(this.props.theirDID), resp.data["content"])
        this.setState({
          failedMessage: resp.data["content"]
        });

      }
      else if(resp.data["status"] === "sent") {
        this.props.getUI();
        if(this.statusCheck !== undefined) {
            clearInterval(this.statusCheck);
            this.statusCheck = undefined;
            localStorage.setItem('failedMessage'.concat(this.props.theirDID), "")
            this.setState({
              failedMessage: ""
            });
        }
      }
    });
  }

  displayMessages() {
    var output = [];
    for(var item in this.props.messages){
      if(this.props.messages[item]['from'] === 'incoming') {
        output.push(
          <div key={this.props.messages[item]['sent_time']}>
            <div className="received">
              {this.props.connectionImage != null ? this.props.connectionImage : this.state.agentImage}
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
              {this.props.myImage}
              <p>{this.props.messages[item]['content']}</p>
            </div>
            <br />
          </div>
        );
      }
    }
    if(this.state.failedMessage !== null && this.state.failedMessage !== "") {
      console.log("Failed Message");
      output.push(
        <div key={this.state.failedMessage.concat("Failure")}>
          <div className="failedMessage">
            {this.props.myImage}
            <p>Message Not Sent: {this.state.failedMessage}</p>
          </div>
          <br />
          <Media object src={messageFailure} className="failedMessageIcon" onClick={this.reSendMessage}/>
        </div>
      );
    }
    this.scrollToBottom();
    return output;
  }

  sendMessage() {
    const promise = this.props.signalEvent({
      domain : "sovrin",
      type: "check_connection",
      attrs : {
        their_vk: this.props.their_vk,
        content: this.state.message
      }
    });
    promise.then((resp) => {
      this.props.getUI();
      this.getLastMessageStatus();
      this.setState({
        message: ""
      });
    })
  }

  reSendMessage() {
    const promise = this.props.signalEvent({
      domain : "sovrin",
      type: "check_connection",
      attrs : {
        their_vk: this.props.their_vk,
        content: this.state.failedMessage
      }
    });
    promise.then((resp) => {
      this.props.getUI();
      this.getLastMessageStatus();
    });
  }

  refreshMessage() {
    this.props.getUI();
  }

  scrollToBottom() {
    var element = document.getElementById("chatBody");
    if(element !== null) {
      element.scrollTop = element.scrollHeight;
      console.log(element.scrollHeight);
    }
  }

  render() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
    return (
      <div>
        <div id="chatBody" className="chatBody">
          {this.displayMessages()}
          {this.scrollToBottom()}
        </div>
        <InputGroup>
          <Input autoFocus id={this.props.invitation.concat(this.props.title)} onMouseDown={(e)=>{ e.stopPropagation();}}
            type="text" name="message" placeholder="Send Message" onKeyDown={(e)=>{ if(e.keyCode === 13){this.sendMessage()}}} value={this.state.message} onChange={this.onChange('message')}/>
          <InputGroupAddon addonType="append">
            <Button onClick={this.sendMessage} color="secondary">Send</Button>
          </InputGroupAddon>
         </InputGroup>
         {(this.state.failedMessage !== null && this.state.failedMessage !== '') && <div id="snackbar">Your last message to {this.props.title} was not sent...</div>}
       </div>
    );
  }
}
export default Chat;
