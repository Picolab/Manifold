import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import './CharacterProfile.css';
import { displayError } from '../../../../../utils/manifoldSDK';
import { styles } from '../ModalStyles';
import RaceSelection from './RaceSelection';
import ClassSelection from './ClassSelection';
import AbilitySelection from './AbilitySelection'
import CharacterDisplay from './CharacterDisplay';
import Other from './Other';


class CharacterProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false,
      races: null,
      classes: null,
      abilities: null,
      character: null,
      characterBuild: {}

    };
    this.toggle = this.toggle.bind(this);
    this.getCharacterCreationData = this.getCharacterCreationData.bind(this);
    this.buildCharacter = this.buildCharacter.bind(this);
    this.getCharacter = this.getCharacter.bind(this);
    this.setCharacter = this.setCharacter.bind(this);
  }

  componentDidMount() {
    this.getCharacter();
  }

  getCharacter() {
    const promise = this.props.manifoldQuery({
      rid: "D-D_Character_Profile",
      funcName: "getCharacter"
    });
    promise.then((resp) => {
      let character = Object.keys(resp.data).length === 0 ? null : resp.data
      if(character) {
        this.getCharacterCreationData()
      }
      this.setState({
        character: character
      });
    }).catch((e) => {
        displayError(true, "Error getting Character.", 404);
    });
  }

  buildCharacter(key, value) {
    let map = this.state.characterBuild
    map[key] = value
    this.setState({
      characterBuild: map
    })

    console.log("character", map);
  }

  toggle() {
    localStorage.removeItem("profeciencies");
    this.setState(prevState => ({
      modal: !prevState.modal,
      activeTab: '1',
      characterBuild: {}
    }));
  }

  tabToggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  completeCharacter() {
    if(this.state.characterBuild.race && this.state.characterBuild.class && this.state.characterBuild.profeciencies !== undefined && this.state.characterBuild.profeciencies.isComplete === true) {
      return true
    }
    return false;
  }

  getCharacterCreationData() {
    if(!(this.state.races && this.state.classes && this.state.abilities)) {
      const promise = this.props.manifoldQuery({
        rid: "D-D_Character_Profile",
        funcName: "getCharacterCreationData"
      });
      promise.then((resp) => {
        let results = resp.data

        this.setState({
          races: results.races,
          classes: results.classes,
          abilities: results.abilities
        });
      }).catch((e) => {
          displayError(true, "Error getting Character Creation Data.", 404);
      });
    }
  }

  setCharacter() {
    const promise = this.props.signalEvent({
      domain: "dnd",
      type: "set_character",
      attrs : { character: JSON.stringify(this.state.characterBuild) }
    });
    promise.then((resp) => {
      this.getCharacter();
      this.toggle();
    }).catch((e) => {
        displayError(true, "Error setting Character.", 404);
    });
  }

  displayCharacter() {
    if(this.state.character) {
      console.log(this.state.abilities);
      return(
        <div style={{ "marginTop": "5%"}}>
          <CharacterDisplay
            character={this.state.character}
            abilities={this.state.abilities}
          />
          <button className="D-DButton" onClick={()=>{this.getCharacterCreationData(); this.toggle();}}> Create New Character </button>
        </div>
      )
    }
    else {
      return(
        <div className="center-container">
          No Character Created
          <button className="D-DButton" onClick={()=>{this.getCharacterCreationData(); this.toggle();}}> Create Character </button>
        </div>
      )
    }
  }

  render() {
    let { abilities, races, classes, characterBuild } = this.state

    return(
      <div className="profile-container">
        {this.displayCharacter()}
        <Modal style={{"border": "1px solid red", "borderColor": "red"}} isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader style={styles.modalContent} toggle={this.toggle}>Character Creation</ModalHeader>
          <ModalBody style={styles.modalContent}>
            <div>
              <Nav tabs>
                <NavItem>
                  <NavLink
                    style={(this.state.activeTab === '1') ? styles.navLink : {}}
                    onClick={() => { this.tabToggle('1'); }}
                  >
                    Races
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={(this.state.activeTab === '2') ? styles.navLink : {}}
                    onClick={() => { this.tabToggle('2'); }}
                  >
                    Classes
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={(this.state.activeTab === '3') ? styles.navLink : {}}
                    onClick={() => { this.tabToggle('3'); }}
                  >
                    Abilities
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={(this.state.activeTab === '4') ? styles.navLink : {}}
                    onClick={() => { this.tabToggle('4'); }}
                  >
                    Other
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent style={styles.tabContent} activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <RaceSelection
                    races={races}
                    abilities={abilities}
                    buildCharacter={this.buildCharacter}
                  />
                </TabPane>
                <TabPane tabId="2">
                  <ClassSelection
                    classes={classes}
                    abilities={abilities}
                    buildCharacter={this.buildCharacter}
                  />
                </TabPane>
                <TabPane tabId="3">
                  <AbilitySelection
                    abilities={abilities}
                    ability_bonus={(characterBuild.race) ? characterBuild.race.ability_bonuses[0] : {} }
                    buildCharacter={this.buildCharacter}
                  />
                </TabPane>
                <TabPane tabId="4">
                  <Other
                    buildCharacter={this.buildCharacter}
                  />
                </TabPane>
              </TabContent>
            </div>
          </ModalBody>
          <ModalFooter style={styles.modalFooter}>
            {this.completeCharacter() ? <button className="D-DButton" onClick={this.setCharacter} >Create</button>
                                      : <button className="DisabledD-DButton" >Create</button>}{' '}
          </ModalFooter>
        </Modal>
      </div>
    );
  }

}
export default CharacterProfile;
