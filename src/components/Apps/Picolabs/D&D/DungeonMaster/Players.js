import React from 'react';
import {customQuery, displayError} from '../../../../../utils/manifoldSDK';
import defaultImage from '../D&D.png';
import PlayerInformation from './PlayerInformation';

class Players extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameEci: this.props.gameEci,
      abilities: this.props.abilities,
      playerInformation: { toggle: false, details: null }
    };

    this.getGameInvite = this.getGameInvite.bind(this);

  }

  componentDidMount() {
    this.getGameInvite();
    this.getPlayersInfo();
  }

  toggleDetails(details) {
    this.setState({
      playerInformation: {
        toggle: !this.state.playerInformation.toggle,
        details: details
      }
    })
  }

  getPlayersInfo() {
    const promise = customQuery(this.state.gameEci, "DND_Story", "getPlayers");
    promise.then((resp) => {
      this.setState({
        players: resp.data
      })
    }).catch((e) => {
      displayError(true, "Error getting players.", 404);
    });
  }

  copyInvitation(e) {
    const text = document.getElementById(e.target.id);
    text.select();
    document.execCommand('copy');
  }


  getGameInvite() {
    const promise = customQuery(this.state.gameEci, "DND_Story", "getGameInvite");
    promise.then((resp) => {
      this.setState({
        gameInvite: resp.data
      })
    }).catch((e) => {
      displayError(true, "Error getting game invite.", 404);
    });
  }

  displayPlayers() {
    let out = []
    let players = this.state.players
    for (let i in players) {
      let image = players[i].image;
      let name = players[i].name;
      out.push(
        <div className="playerContainer">
          <img src={image ? image : defaultImage}  className="playerImage"/>
          <div className="playerName">
            <div>{name ? name : "No name"}</div>
            <div>{players[i].race.name}</div>
            <div>{players[i].class.name}</div>
          </div>
          <div className="selectionDetails" onClick={()=>{this.toggleDetails(players[i]);}}>Details</div>
        </div>
      )
    }


    return out;
  }

  displayPlayerContainer() {

    if(!this.state.playerInformation.toggle) {
      return (
        <div>
          <h3>Players:</h3>
          {this.displayPlayers()}
        </div>
      )
    }
    return (
      <PlayerInformation
        character={this.state.playerInformation.details}
        abilities={this.props.abilities}
        toggleDetails={()=>{this.toggleDetails(null);}}
      />
    )
  }


  render() {
      return(
        <div className="playersColumn">
          <div>Game Invite</div>
          <div className="invitationContainer">
            <input type="text" placeholder="Invitation" id={this.state.gameInvite} defaultValue={this.state.gameInvite}/>
            <button className="DNDSearchButton" id={this.state.gameInvite} onClick={this.copyInvitation}>Copy</button>
          </div>
          <div className="playersContainer">
            {this.displayPlayerContainer()}
          </div>
        </div>
      );
  }

}
export default Players;
