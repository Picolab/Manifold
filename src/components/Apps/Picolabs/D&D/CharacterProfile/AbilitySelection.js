import React from 'react';
import AbilityInformation from './AbilityInformation';
import { Input } from 'reactstrap';

class AbilitySelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      abilities: this.props.abilities,
      abilityInformation: { toggle: false, details: null },
      ability_bonus: this.props.ability_bonus,
      ability_choices: {},

    };
    this.handleBaseScoreChange = this.handleBaseScoreChange.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        abilities: this.props.abilities,
        ability_bonus: this.props.ability_bonus
      })
    }
  }

  toggleDetails(details) {
    this.setState({
      abilityInformation: {
        toggle: !this.state.abilityInformation.toggle,
        details: details
      }
    })
  }

  handleBaseScoreChange(e) {
    let score = e.target.value
    let id = e.target.id
    this.setState({
      [id]: score
    }, ()=>{this.setAttributes()})
  }

  setAttributes() {
    let { abilities, ability_bonus } = this.state
    let map = {}
    for(let i in abilities) {
      let bonus = (ability_bonus.name === abilities[i].name) ? ability_bonus.bonus : 0
      let total = parseInt(this.state[abilities[i].name],10) + parseInt(bonus, 10)
      map[abilities[i].name] = isNaN(total) ? bonus : total
    }

    this.props.buildCharacter("abilities", map);
  }

  displayAbilities() {
    let { abilities, ability_bonus, ability_choices } = this.state
    let out = []
    let map = {}
    for(let i in abilities) {
      // let ability_score = ability_choices[abilities[i].name] ? ability_choices[abilities[i].name].score : 0
      let bonus = (ability_bonus.name === abilities[i].name) ? ability_bonus.bonus : 0
      let total = parseInt(this.state[abilities[i].name],10) + parseInt(bonus, 10)
      out.push(
        <div>
          <div key={abilities[i].name} className="selectionListItem">
            {abilities[i].full_name}
            <div className="selectionDetails" onClick={()=>{this.toggleDetails(abilities[i]);}}>Details</div>
          </div>
          <div style={{"margin": "5px"}}>
            <div>
              Race Bonus: + {bonus}
            </div>
            <div>
              Base Score: + <input type="number" id={abilities[i].name} name={abilities[i].name} value={this.state[abilities[i].name]} onChange={this.handleBaseScoreChange} className="baseScoreInput"/>
            </div>
            <div>
              Total Score: {isNaN(total) ? bonus : total }
            </div>
          </div>
        </div>
      )

    }
    return out;
  }


  render() {
    if(this.state.abilities) {
      if(!this.state.abilityInformation.toggle) {
        return(
          <div>
            {this.displayAbilities()}
          </div>
        )
      }
      return(
        <AbilityInformation
          details={this.state.abilityInformation.details}
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
export default AbilitySelection;
