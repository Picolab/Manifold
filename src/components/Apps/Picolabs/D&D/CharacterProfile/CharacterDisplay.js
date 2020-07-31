import React from 'react';
import { Media } from 'reactstrap';
import character from './character.jpg'
class CharacterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };

  }


  render() {
    return(
      <div>
        <div className="row">
          <div className="column" >
            <Media object src={character} className="characterImage" />
          </div>
          <div className="column" style={{"width": "43.33%", "margin": "-2%"}} >
            <div className="characterName">Some Name</div>
            <div className="characterSubHeader">Some Race</div>
            <div className="characterSubHeader">Some Class</div>
            <div className="characterSubHeader">Description: </div>
            <div className="characterDescription">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris urna ante, pretium ac enim ac, tempor hendrerit sem. Mauris fermentum eros in purus sagittis, id sollicitudin eros maximus. Nullam nec interdum libero, sit amet hendrerit tortor. Aliquam iaculis, augue vitae sodales ullamcorper, neque tellus hendrerit augue, vel suscipit lacus mauris nec lectus. Duis a tellus dolor. Curabitur cursus, mauris id tempus semper, purus lectus porta justo, ac sollicitudin dui turpis vitae dolor. Nullam vel diam in justo commodo molestie. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris urna ante, pretium ac enim ac, tempor hendrerit sem. Mauris fermentum eros in purus sagittis, id sollicitudin eros maximus. Nullam nec interdum libero, sit amet hendrerit tortor. Aliquam iaculis, augue vitae sodales ullamcorper, neque tellus hendrerit augue, vel suscipit lacus mauris nec lectus. Duis a tellus dolor. Curabitur cursus, mauris id tempus semper, purus lectus porta justo, ac sollicitudin dui turpis vitae dolor. Nullam vel diam in justo commodo molestie.
            </div>
          </div>
        </div>
        <div className="characterName">Abilities</div>
        <div className="characterAbilities">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris urna ante, pretium ac enim ac, tempor hendrerit sem. Mauris fermentum eros in purus sagittis, id sollicitudin eros maximus. Nullam nec interdum libero, sit amet hendrerit tortor.
        </div>
        <div className="characterName">Equipment</div>
        <div className="characterEquipment">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris urna ante, pretium ac enim ac, tempor hendrerit sem. Mauris fermentum eros in purus sagittis, id sollicitudin eros maximus. Nullam nec interdum libero, sit amet hendrerit tortor.
        </div>
      </div>
    );
  }

}
export default CharacterDisplay;
