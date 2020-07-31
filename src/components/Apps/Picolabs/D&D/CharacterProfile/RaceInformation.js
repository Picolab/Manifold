import React from 'react';

class RaceInformation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      details: (this.props.details) ? this.props.details : {}
    };

  }

  componentDidUpdate(prevProps) {
    if (this.props.details !== prevProps.details) {
      this.setState({
        details: this.props.details
      })
    }
  }

  displayAbilityBonus() {
    let out = []
    let bonuses = this.state.details.ability_bonuses
    for (let i in bonuses) {
      out.push(
        <div key={bonuses[i].name}>
          +{bonuses[i].bonus} {this.props.abilities[bonuses[i].name].full_name}
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
    let details = this.state.details
    return(
      <div>
        <div className="detailsHeader">
          <div className="backButtonContainer" onClick={this.props.toggleDetails}>
            <i className="fa fa-arrow-left returnToConnections" />
            Back
          </div>
          <div className="detailsSectionTitle">
            {details.name} Details
          </div>
        </div>
        <div className="detailsSection">
          Ability Bonus:
          {this.displayAbilityBonus()}
        </div>
        <div className="detailsSection">
          Age: {details.age}
        </div>
        <div className="detailsSection">
          Size: {details.size_description}
        </div>
        <div className="detailsSection">
          Languages:
          {this.displaySectionList(details.languages)}
          {details.language_desc}
        </div>
          Traits:
          {this.displaySectionList(details.traits)}
      </div>
    )
  }

}
export default RaceInformation;
