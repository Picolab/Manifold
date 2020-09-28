import React from 'react';
import CharacterProfile from './CharacterProfile/CharacterProfile'
import CreateGameModal from './CreateGameModal'
import JoinGameModal from './JoinGameModal'
import { Media } from 'reactstrap';
import icon from './D&D.png';
import { displayError } from '../../../../utils/manifoldSDK';

class HomeDND extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      character: null
    };
    this.getCharacter = this.getCharacter.bind(this);
  }

  componentDidMount() {
    this.getCharacter();
  }

  getCharacter() {
    const promise = this.props.manifoldQuery({
      rid: "DND_Character_Profile",
      funcName: "getCharacter"
    });
    promise.then((resp) => {
      let character = Object.keys(resp.data).length === 0 ? null : resp.data
      this.setState({
        character: character
      });
    }).catch((e) => {
        displayError(true, "Error getting Character.", 404);
    });
  }


  render() {
    return(
      <div>
        <div className="home row" style={{"height": "100vh"}}>
          <div className="overlay homeColumn">
            <Media object src={icon} className='icon'/>
            <div className="center-container">
              <CreateGameModal
                changeCurrentPage={this.props.changeCurrentPage}
                manifoldQuery={this.props.manifoldQuery}
                signalEvent={this.props.signalEvent}
                setGameStatus={this.props.setGameStatus}
              />
              <JoinGameModal
                changeCurrentPage={this.props.changeCurrentPage}
                signalEvent={this.props.signalEvent}
                hasCharacter={this.state.character ? true : false}
              />
            </div>
          </div>
          <div className="overlay homeColumn">
            <CharacterProfile
              manifoldQuery={this.props.manifoldQuery}
              signalEvent={this.props.signalEvent}
              character={this.state.character}
              getCharacter={this.getCharacter}
            />
          </div>
        </div>
      </div>
    );
  }

}
export default HomeDND;
