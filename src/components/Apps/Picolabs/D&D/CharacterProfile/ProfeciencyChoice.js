import React from 'react';

class ProfeciencyChoice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: true,
      choices: this.props.choices,
      choose: this.props.choices.choose,
      choosen: {},
      chosenNumber: 0,
      isActive: true
    };

  }

  choiceHandler(proficiency) {
    console.log(proficiency.name);
    console.log(this.state.choosen);
    let name = proficiency.name
    let value = proficiency
    if(this.state.choosen[name]) {
      let map = this.state.choosen
      delete map[name]
      console.log("map after delete", map);
      this.setState({
        choosen: map,
        chosenNumber: map.size,
        isActive: true
      })
    }
    else {
      if(this.state.isActive) {
        let map = this.state.choosen
        map[name] = value
        //Object.assign({}, map)
        let chosenNumber = map.size
        console.log("map after insert", map);
        this.setState({
          choosen: map,
          chosenNumber: chosenNumber,
          isActive: chosenNumber === this.state.choose ? false : true
        })
      }
    }
  }

  displaySectionList(list) {
    let out = [];
    for (let i in list) {
      let checked = this.state.choosen[list[i].name] ? true : false
      let disabled =  !checked && !this.state.isActive ? true : false
      out.push(
        <div key={list[i].name}>
          <input type="radio" className="profeciencyChoice" onClick={()=>{if(!disabled){this.choiceHandler(list[i]);}}} defaultChecked={checked}/>
            {' '}{list[i].name.split(":")[1]}
        </div>
      )
    }
    return out;
  }

  render() {
    let choices = this.state.choices
    let choose = this.state.choose

    return(
      <div>
        <div className="detailsSection">
          Profeciency Choice: (Choose {choose})
          {this.displaySectionList(choices.from)}
        </div>
      </div>
    )
  }

}
export default ProfeciencyChoice;
