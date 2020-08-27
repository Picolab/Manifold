import React from 'react';
import { Media } from 'reactstrap';
class CharacterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      character: this.props.character,
      abilities: this.props.abilities
    };

  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        abilities: this.props.abilities,
        character: this.props.character
      })
    }
  }

  displayAbilities() {
    let { abilities, character } = this.state
    let out = [];
    for (let i in abilities) {
      out.push(
        <div>
          {abilities[i].full_name}: {character.abilities[abilities[i].name]}
        </div>
      )
    }
    return out;
  }

  displaySection(section) {
    let { character } = this.state
    let out = [];
    for (let i in section) {
      out.push(
        <div>
          {section[i].name}
        </div>
      )
    }
    return out;
  }

  render() {
    let character = this.state.character
    return(
      <div>
        <div className="row" style={{"marginRight": "0px", "marginLeft": "0px"}}>
          <div className="homeColumn" >
            <Media object src={character.image} className="characterImage" />
          </div>
          <div className="homeColumn">
            <div className="characterName">{character.name}</div>
            <div className="characterSubHeader">{character.race.name}</div>
            <div className="characterSubHeader">{character.class.name}</div>
            <div className="characterSubHeader">Descripton: </div>
            <div className="characterDescription">
            {character.descripton}
            </div>
          </div>
        </div>
        <div className="characterRow">
          <div className="characterColumn">
            <div className="characterTitleSection">Abilities:</div>
            <div className="characterSection">
              {this.displayAbilities()}
            </div>
          </div>
          <div className="characterColumn">
            <div className="characterTitleSection">Profeciencies:</div>
            <div className="characterSection">
              {this.displaySection(character.profeciencies)}
            </div>
          </div>
          <div className="characterColumn">
            <div className="characterTitleSection">Languages:</div>
            <div className="characterSection">
              {this.displaySection(character.race.languages)}
            </div>
          </div>
          <div className="characterColumn">
            <div className="characterTitleSection">Traits:</div>
            <div className="characterSection">
              {this.displaySection(character.race.traits)}
            </div>
          </div>
        </div>
        <div className="characterFullColumn">
          <div className="characterTitleSection">Alignment:</div>
          <div className="characterSection">
            {character.race.alignment}
          </div>
        </div>
        <div className="characterFullColumn">
          <div className="characterTitleSection">Age:</div>
          <div className="characterSection">
            {character.race.age}
          </div>
        </div>
        <div className="characterFullColumn">
          <div className="characterTitleSection">Size:</div>
          <div className="characterSection">
            {character.race.size_description}
          </div>
        </div>
      </div>
    );
  }

}
export default CharacterDisplay;
