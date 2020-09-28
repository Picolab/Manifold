import React from 'react';
import { Media } from 'reactstrap';
import GameSearch from './GameSearch';
import Players from './Players';
import Story from './Story';
import { displayError } from '../../../../../utils/manifoldSDK';
import icon from '../D&D.png';
import './DungeonMasterView.css';

class DungeonMasterView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameEci: this.props.gameEci,
      loading: true
    };

    this.getGameEci = this.getGameEci.bind(this);
  }

  componentDidMount() {
    this.getCharacterAbilities()
  }

  getCharacterAbilities() {
    if(!this.state.abilities) {
      const promise = this.props.manifoldQuery({
        rid: "DND_Character_Profile",
        funcName: "getCharacterCreationData",
        funcArgs: {specific: "abilities"}
      });
      promise.then((resp) => {
        let results = resp.data

        this.setState({
          abilities: results
        });
      }).catch((e) => {
          displayError(true, "Error getting Character abilities.", 404);
      });
    }
    
  }

  getGameEci() {
    const promise = this.props.manifoldQuery({
      rid: "DND_Game",
      funcName: "getGameECI"
    });
    promise.then((resp) => {
      this.setState({
        gameEci: resp.data,
        loading: false
      })
    }).catch((e) => {
        displayError(true, "Error getting Game ECI.", 404);
    });
  }


  render() {
    return(
      <div>
        <div className="createGame row" style={{"height": "100vh"}}>
          <div class="overlay createGameColumn">
            <Media object src={icon} className='icon'/>
            <Players
              gameEci={this.props.gameEci}
              abilities={this.state.abilities}
            />
          </div>
          <div className="overlay createGameColumn">
            <Story 
              manifoldQuery={this.props.manifoldQuery}
            />
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
export default DungeonMasterView;
