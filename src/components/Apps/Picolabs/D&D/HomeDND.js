import React from 'react';
import CharacterProfile from './CharacterProfile/CharacterProfile'
import CreateGameModal from './CreateGameModal'
import { Media } from 'reactstrap';
import icon from './D&D.png';

class HomeDND extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

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
              />
              <button className="D-DButton"> Join Game</button>
            </div>
          </div>
          <div className="overlay homeColumn">
            <CharacterProfile
              manifoldQuery={this.props.manifoldQuery}
              signalEvent={this.props.signalEvent}
            />
          </div>
        </div>
      </div>
    );
  }

}
export default HomeDND;
