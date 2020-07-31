import React from 'react';
import CharacterProfile from './CharacterProfile/CharacterProfile'
import { Media } from 'reactstrap';
import icon from './D&D.png';
import "./DungeonsAndDragons.css"

class DungeonsAndDragons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }


  render() {
    return(
      <div>
        <div className="row" style={{"height": "100vh"}}>
          <div className="column">
            <Media object src={icon} className='icon'/>
            <div className="center-container">
              <button className="D-DButton"> Create Game </button>
              <button className="D-DButton"> Join Game</button>
            </div>
          </div>
          <div className="column">
            <CharacterProfile
              manifoldQuery={this.props.manifoldQuery}
            />
          </div>
        </div>
      </div>
    );
  }

}
export default DungeonsAndDragons;
