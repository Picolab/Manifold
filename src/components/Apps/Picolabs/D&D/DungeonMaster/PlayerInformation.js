import React from 'react';
import defaultImage from '../D&D.png';

class PlayerInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      character: this.props.character,
      abilities: this.props.abilities
    };

  }

  componentDidUpdate(prevProps) {
    if (this.props.details !== prevProps.details) {
      this.setState({
        abilities: this.props.abilities,
        character: this.props.character
      })
    }
  }

  displayAbilities() {
    let { abilities, character } = this.state
    console.log("abilities", abilities);
    let out = [];
    for (let i in abilities) {
      out.push(
        <div style={{"margin": "8px"}}>
          {abilities[i].full_name}: {character.abilities[abilities[i].name]}
        </div>
      )
    }
    return out;
  }

  displaySectionList(list) {
    let out = [];
    for (let i in list) {
      out.push(
        <div key={list[i].name} className="detailsSectionList">
          {list[i].name}
        </div>
      )
    }
    return out;
  }

  render() {
    let character = this.state.character
    let image = character.image
    let name = character.name
    return(
      <div>
        <div className="detailsHeader">
          <div className="backButtonContainer" onClick={this.props.toggleDetails}>
            <i className="fa fa-arrow-left returnToConnections" />
            Back
          </div>
          <div className="detailsSectionTitle">
            {character.name} Details
          </div>
        </div>
        <div className="playerInfoSection">
          <div className="playerInfoImageContainer">
            <img src={image ? image : defaultImage}  className="playerInfoImage"/>
            <div className="playerInfoName">
              <div>Name: {name ? name : "No name"}</div>
              <div>Race: {character.race.name}</div>
              <div>Class: {character.class.name}</div>
            </div>
          </div>
        </div>
        <div className="playerInfoSection">
          Abilities:
          <div className="playerInfoAbilities">
            {this.displayAbilities()}
          </div>
        </div>
      </div>
    )
  }

}
export default PlayerInformation;
