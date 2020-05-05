import React from 'react';
import { InputGroup, InputGroupAddon, Button, Input, Media} from 'reactstrap';
import { retrieveOwnerProfile } from '../../../../utils/manifoldSDK';
import messageFailure from './failedmessage.png';
import './messaging.css';

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
      console.log(this.curr);
    }, this.curr * 1000);
  }

  retrieveMessages() {
    let promise = this.props.manifoldQuery({
      rid: "org.sovrin.aca.basicmessage",
      funcName: "basicmessages",
      funcArgs: {
        their_vk: this.props.their_vk
      }
    }).catch((e) => {
        console.error("Error getting messages", e);
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

  refreshMessage() {
    this.props.getUI();
  }

  scrollToBottom() {
    var element = document.getElementById("chatBody");
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
        <div id="chatBody" className="chatBody">
          {this.state.loadingMessages ? this.loading() : this.displayMessages()}
          {this.scrollToBottom()}
        </div>
        <InputGroup>
          <Input className="messageInput" autoFocus id={this.props.invitation.concat(this.props.title)} onMouseDown={(e)=>{ e.stopPropagation();}}
            type="text" name="message" placeholder="Send Message" onKeyDown={(e)=>{ if(e.keyCode === 13){this.sendMessage()}}} value={this.state.message} onChange={this.onChange('message')}/>
          <InputGroupAddon addonType="append">
            <div className="sendMessageButtonContainer">
              <i className="fa fa-paper-plane sendButton" onClick={this.sendMessage} />
            </div>
          </InputGroupAddon>
         </InputGroup>
       </div>
    );
  }
}
export default Chat;

//            <Button className="sendButton" onClick={this.sendMessage}>Send</Button>
