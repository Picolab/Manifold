import React from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import { displayError } from '../../../../../utils/manifoldSDK';

class Story extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      game_rid: "DND_Dungeon_Master",
      message: ""
    };

    this.getStory = this.getStory.bind(this);
  }

  componentDidMount() {
    this.getStory()
  }

  scrollToBottom() {
    var element = document.getElementById("messagingBody");
    if(element !== null) {
      element.scrollTop = element.scrollHeight;
    }
  }

  onChange(stateKey) {
    return (event) => {
      let value = event.target.value
      this.setState({
        [stateKey]: value
      })
    }
  }

  getStory() {
    let promise = this.props.manifoldQuery({
      rid: this.state.game_rid,
      funcName: "getStory",
      funcArgs: {}
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
    });
  }

  sendMessage() {

  }

  displayMessages() {
    var output = [];
    for(var item in this.state.messages){
      if(this.state.messages[item] !== null) {
        if(this.state.messages[item]['from'] === 'incoming') {
          output.push(
            <div key={this.state.messages[item]['sent_time']}>
              <div className="DNDreceived">
                <p>{this.state.messages[item]['content']}</p>
              </div>
              <br />
            </div>
          );
        }
        else {
          output.push(
            <div key={this.state.messages[item]['sent_time']}>
              <div className="DNDsent">
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


  loading() {
    return (
      <div className="loadingio-spinner-spinner-e99p94i3o4p"><div className="ldio-o87ynsbkwv">
      <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
      </div></div>
    )
  }


  render() {
    return(
      <div className="story">
      <div className="storyHeader">Story</div>
       <div id="messagingBody" className="storyBody">
          {this.state.loadingMessages ? this.loading() : this.displayMessages()}
          {this.scrollToBottom()}
        </div>
        <InputGroup>
          <Input className="DNDmessageInput" autoFocus id={"put something unique"} onMouseDown={(e)=>{ e.stopPropagation();}}
            type="text" name="message" placeholder="Send Message" onKeyDown={(e)=>{ if(e.keyCode === 13){this.sendMessage()}}} value={this.state.message} onChange={this.onChange('message')}/>
          <InputGroupAddon addonType="append">
            <div className="DNDsendMessageButtonContainer" onClick={this.sendMessage}>
              <i className="fa fa-paper-plane DNDsendButton" />
            </div>
          </InputGroupAddon>
         </InputGroup>
      </div>
    )
  }

}
export default Story;
