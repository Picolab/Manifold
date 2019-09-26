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
      uiMessages: null,
      messages: [],
      message: "",
      myImage: <svg className="profilePic" data-jdenticon-value={this.props.myName}></svg>,
      agentImage: <svg className="connectionPic" data-jdenticon-value={this.props.title}></svg>,
      currentMSGstatus: "",
      failedMessage: failedMessage === null | failedMessage === 'null' ? "" : failedMessage
    };
    this.getProfileInfo = this.getProfileInfo.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.reSendMessage = this.reSendMessage.bind(this);
    this.retrieveMessages = this.retrieveMessages.bind(this);
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
    //this.getProfileInfo();
  }

  componentDidUpdate() {
    this.scrollToBottom();
    if(JSON.stringify(this.state.uiMessages) !== JSON.stringify(this.props.messages)) {
      this.setState({
        uiMessages: this.props.messages
      });
      this.retrieveMessages();
    }
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

  retrieveMessages() {
    if(this.props.hasRouter) {
      const promise = this.props.manifoldQuery({
        rid: "org.sovrin.manifold_agent",
        funcName: "retrieveMSGs",
        funcArgs: {
          their_vk: this.props.their_vk
        }
      }).catch((e) => {
          console.error("Error getting messages", e);
      });
      promise.then((resp) => {
        this.setState({
            messages: resp.data
        })
      });
    }
    else {
      const promise = this.props.manifoldQuery({
        rid: "org.sovrin.manifold_agent",
        funcName: "getMSGs",
        funcArgs: {
          their_vk: this.props.their_vk
        }
      }).catch((e) => {
          console.error("Error getting messages", e);
      });
      promise.then((resp) => {
        this.setState({
            messages: resp.data
        })
      });
    }
  }

  getLastMessageStatus() {
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
        // this.setState({
        //   currentMSGstatus: resp.data["status"]
        // })
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
        }
        // this.setState({
        //   currentMSGstatus: resp.data["status"]
        // })
      }
    });
  }

  displayMessages() {
    var output = [];
    for(var item in this.state.messages){
      if(this.state.messages[item] !== null) {
        if(this.state.messages[item]['from'] === 'incoming') {
          output.push(
            <div key={this.state.messages[item]['sent_time']}>
              <div className="received">
                {this.props.connectionImage != null ? this.props.connectionImage : this.state.agentImage}
                <p>{this.state.messages[item]['content']}</p>
              </div>
              <br />
            </div>
          );
        } else {
          if(this.state.messages[item]['failed'] === undefined) {
            output.push(
              <div key={this.state.messages[item]['sent_time']}>
                <div className="sent">
                  {this.props.myImage}
                  <p>{this.state.messages[item]['content']}</p>
                </div>
                <br />
              </div>
            );
          } else {
              output.push(
                <div key={this.state.messages[item]['sent_time'].concat("Failure")}>
                  <div className="failedMessage">
                    {this.props.myImage}
                    <p>Message Not Sent: {this.state.messages[item]['content']}</p>
                  </div>
                  <br />
                  <Media object src={messageFailure} className="failedMessageIcon" id={this.state.messages[item]['sent_time']} title={this.state.messages[item]['content']} onClick={(e)=>{this.reSendMessage(e.target.title, e.target.id)}}/>
                </div>
              );
          }
        }
      }
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
      localStorage.setItem('failedMessage'.concat(this.props.theirDID), '')
      this.setState({
        failedMessage: ''
      });
      this.getLastMessageStatus();
      this.setState({
        message: ''
      });
    })
  }

  reSendMessage(cont, time) {
    console.log(time);
    console.log(cont);
    const promise = this.props.signalEvent({
      domain : "sovrin",
      type: "check_connection",
      attrs : {
        their_vk: this.props.their_vk,
        content: cont,
        sent_time: time
      }
    });
    promise.then((resp) => {
      this.props.getUI();
      localStorage.setItem('failedMessage'.concat(this.props.theirDID), '')
      this.setState({
        failedMessage: ''
      });
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
    }
  }

  //{(this.state.failedMessage !== null && this.state.failedMessage !== '') && <div id="snackbar">Your last message to {this.props.title} was not sent...</div>}

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
       </div>
    );
  }
}
export default Chat;
