import React from 'react';
import RaceInformation from './RaceInformation';

class RaceSelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      races: this.props.races,
      raceInformation: { toggle: false, details: null }
    };
    this.toggleDetails= this.toggleDetails.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.races !== prevProps.races) {
      this.setState({
        races: this.props.races
      })
    }
  }

  toggleDetails(details) {
    this.setState({
      raceInformation: {
        toggle: !this.state.raceInformation.toggle,
        details: details
      }
    })
  }

  handleRaceChoice(raceChoice) {
    this.setState({
      raceChoice: raceChoice.name
    })
    this.props.buildCharacter("race", raceChoice)
  }

  displayRaces() {
    let races = this.state.races
    let out = []
    for(let i in races) {
      out.push(
        <div key={races[i].name} className="selectionListItem">
          <input className="selectionRadioButton" type="radio" name="race" value={races[i].name} onClick={()=>{this.handleRaceChoice(races[i]);}} defaultChecked={this.state.raceChoice === races[i].name}/> {races[i].name}
          <div className="selectionDetails" onClick={()=>{this.toggleDetails(races[i]);}}>Details</div>
        </div>
      )
    }
    return out;
  }


  render() {
    if(this.state.races) {
      if(!this.state.raceInformation.toggle) {
        return(
          <div>
            {this.displayRaces()}
          </div>
        )
      }
      return(
        <RaceInformation
          details={this.state.raceInformation.details}
          abilities={this.props.abilities}
          toggleDetails={()=>{this.toggleDetails(null);}}
        />
      )
    }
    return(
      <div>
        Loading...
      </div>
    )
  }

}
export default RaceSelection;
