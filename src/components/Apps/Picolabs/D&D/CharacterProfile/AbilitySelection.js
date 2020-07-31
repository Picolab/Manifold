import React from 'react';

class AbilitySelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      abilities: this.props.abilities
    };

  }

  componentDidUpdate(prevProps) {
    if (this.props.abilities !== prevProps.abilities) {
      this.setState({
        abilities: this.props.abilities
      })
    }
  }

  displayAbilities() {
    let abilities = this.state.abilities
    let out = []
    for(let i in abilities) {
      out.push(
        <div key={abilities[i].name}>
          {abilities[i].name}
        </div>
      )
    }
    return out;
  }


  render() {

    if(this.state.abilities) {
      return(
        <div>
          {this.displayAbilities()}
        </div>
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
