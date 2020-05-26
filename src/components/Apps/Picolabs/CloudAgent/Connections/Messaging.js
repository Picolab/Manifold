import React from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import './Messaging.css';
import { displayError } from '../../../../../utils/manifoldSDK';

class Messaging extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "No User Found",
      imgURL: "",
      uiMessages: null,
      messages: [],
      message: "",
      myImage: <svg className="profilePic" data-jdenticon-value={this.props.myName}></svg>,
      agentImage: <svg className="connectionPic" data-jdenticon-value={this.props.title}></svg>,
      canMessage: true,
      loadingMessages: true
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.retrieveMessages = this.retrieveMessages.bind(this);
    this.poll = this.poll.bind(this);
    this.resetPoll = this.resetPoll.bind(this);
    this.visibilitychange = this.visibilitychange.bind(this);
    this.messageTimeout = null;
    this.prev = 1;
    this.curr = 1;
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
    this.poll()
    window.addEventListener("mouseover", this.resetPoll)
    window.addEventListener("visibilitychange", this.visibilitychange)
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    clearTimeout(this.messageTimeout);
    window.removeEventListener("mouseover", this.resetPoll);
    window.removeEventListener("visibilitychange", this.visibilitychange);
  }

  resetPoll() {
    clearTimeout(this.messageTimeout);
    this.prev = 1;
    this.curr = 1;
    this.poll();
  }

  visibilitychange() {
    if(!document.hidden) {
      this.resetPoll();
    }
  }

  poll() {
    this.messageTimeout = setTimeout(async () => {
      let next = this.prev + this.curr;
      this.prev = this.curr;
      this.curr = next;

      await this.retrieveMessages();
      this.poll()
    }, this.curr * 1000);
  }

  canMessage() {
    const promise = this.props.manifoldQuery({
      rid: "io.picolabs.manifold_cloud_agent",
      funcName: "canMessage"
    })
    promise.then((resp) => {
      this.setState({
        canMessage: resp.data
      });
    }).catch((e) => {
        displayError(true, "Error getting if agent can message.", 404);
        console.error("Error getting if agent can message.", e);
    });
  }

  retrieveMessages() {
    let promise = this.props.manifoldQuery({
      rid: "io.picolabs.aca.basicmessage",
      funcName: "basicmessages",
      funcArgs: {
        their_vk: this.props.their_vk
      }
    });
    promise.then((resp) => {
      if(JSON.stringify(this.state.messages) !== JSON.stringify(resp.data)) {
        if(resp === undefined || resp.data === null) {
          this.setState({
              messages: [],
              loadingMessages: false
          })
        }
        else {
          this.setState({
              messages: resp.data,
              loadingMessages: false
          })
        }

     }
    }).catch((e) => {
        displayError(true, "Error getting messages.", 404);
        console.error("Error getting messages.", e);
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
        }
        else {
          output.push(
            <div key={this.state.messages[item]['sent_time']}>
              <div className="sent">
                {this.props.myImage}
                <p>{this.state.messages[item]['content']}</p>
              </div>
              <br />
            </div>
          );
        }
      }
    }
    this.scrollToBottom();
    return output;
  }

  sendMessage() {
    const promise = this.props.signalEvent({
      domain : "aca_basicmessage",
      type: "new_content",
      attrs : {
        their_vk: this.props.their_vk,
        content: this.state.message
      }
    });
    promise.then((resp) => {
      this.setState({
        message: ""
      })
      this.retrieveMessages()
    })
  }

  scrollToBottom() {
    var element = document.getElementById("messagingBody");
    if(element !== null) {
      element.scrollTop = element.scrollHeight;
    }
  }

  loading() {
    return (
      <div className="loadingio-spinner-spinner-e99p94i3o4p"><div className="ldio-o87ynsbkwv">
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
      </div></div>
    )
  }

  render() {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/jdenticon@2.1.1";
    script.async = true;
    document.body.appendChild(script);
    return (
      <div>
        <div id="messagingBody" className="messagingBody">
          {this.state.loadingMessages ? this.loading() : this.displayMessages()}
          {this.scrollToBottom()}
        </div>
        <InputGroup>
          <Input className="messageInput" autoFocus id={this.props.invitation.concat(this.props.title)} onMouseDown={(e)=>{ e.stopPropagation();}}
            type="text" name="message" placeholder="Send Message" onKeyDown={(e)=>{ if(e.keyCode === 13){this.sendMessage()}}} value={this.state.message} onChange={this.onChange('message')}/>
          <InputGroupAddon addonType="append">
            <div className="sendMessageButtonContainer" onClick={this.sendMessage}>
              <i className="fa fa-paper-plane sendButton" />
            </div>
          </InputGroupAddon>
         </InputGroup>
       </div>
    );
  }
}
export default Messaging;
