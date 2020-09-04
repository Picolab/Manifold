import React from 'react';
import { Media } from 'reactstrap';
import GameSearch from './GameSearch';
import icon from './D&D.png';
import './CreateGame.css';

class CreateGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }


  render() {
    return(
      <div>
        <div className="createGame row" style={{"height": "100vh"}}>
          <div class="overlay createGameColumn">
            <Media object src={icon} className='icon'/>
            <div className="gameInvitationContainer">
              <div>Game Invite</div>
              <input type="text" placeholder="Invitation"/>
            </div>
          </div>
          <div className="overlay createGameColumn">
            Story
          </div>
          <div className="overlay createGameColumn">
            <GameSearch
              manifoldQuery={this.props.manifoldQuery}
            />
          </div>
        </div>
      </div>
    );
  }

}
export default CreateGame;
