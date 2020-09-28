import React from 'react';
import { displayError } from '../../../../../utils/manifoldSDK';

class GameSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      monsterSearch: "",
      monsterResults: {},
      spellResults: []
    };
    this.onChange = this.onChange.bind(this);
    this.monsterSearch = this.monsterSearch.bind(this);
    this.spellSearch = this.spellSearch.bind(this);
  }

  onChange(e) {
    this.setState({
      monsterSearch: e.target.value
    })
  }

  monsterSearch() {
    let monster = this.state.monsterSearch
    if(monster) {
      const promise = this.props.manifoldQuery({
        rid: "DND_Dungeon_Master",
        funcName: "getMonster",
        funcArgs: { monster: monster }
      });
      promise.then((resp) => {
        let result = resp.data
        this.setState({
          monsterResults: result
        });
      }).catch((e) => {
          displayError(true, "Error getting Monster.", 404);
      });
    }
  }

  spellSearch() {
    let spellA = document.getElementById("spellA").value;
    let spellB = document.getElementById("spellB").value;

    if(spellA || spellB) {
      const promise = this.props.manifoldQuery({
        rid: "DND_Dungeon_Master",
        funcName: "getSpell",
        funcArgs: { spellA: spellA, spellB: spellB }
      });
      promise.then((resp) => {
        let results = resp.data
        this.setState({
          spellResults: results
        });
      }).catch((e) => {
          displayError(true, "Error getting spell.", 404);
      });
    }
  }

  displayMonsterSearchResults() {
    let result = this.state.monsterResults
    let out = [];
    if(result) {
      if(Object.keys(result).length) {
        out.push(
          <div class="spellCard">
            <div class="spellCardContainer">
              <h4><b>{result.name}</b></h4>
              <div className="monsterDefinition"><span>Hit Points:</span>{result.hit_points}</div>
              <div className="monsterDefinition"><span>Armor Class:</span>{result.armor_class}</div>
              <div className="monsterDefinition">
                <span>Speed: </span>
                <div className="monsterRow">
                  {this.displayList(result.speed)}
                </div>
              </div>
              <div className="monsterRow">
                <div className="monsterDefinition"><span>STR:</span> {result.strength}</div>
                <div className="monsterDefinition"><span>DEX:</span> {result.dexterity}</div>
                <div className="monsterDefinition"><span>CON:</span> {result.constitution}</div>
                <div className="monsterDefinition"><span>WIS:</span> {result.wisdom}</div>
                <div className="monsterDefinition"><span>INT:</span> {result.intelligence}</div>
                <div className="monsterDefinition"><span>CHA:</span> {result.charisma}</div>
              </div>
              <div className="monsterDefinition">
                <span>Senses:</span>
                <div className="monsterRow">
                  {this.displayList(result.senses)}
                </div>
              </div>
              <div className="monsterHeader">Actions</div>
              {this.displayActions(result.actions)}
              <div className="monsterHeader">Legendary Actions</div>
              {this.displayActions(result.legendary_actions)}
            </div>
          </div>
        )
      }
    }
    else {
      out.push(<div>No Results Found</div>)
    }
    return out
  }

  displayActions(actions) {
    let out = []
    for(let i in actions) {
      out.push(
        <div className="monsterAction">
          <span>{actions[i].name}</span>: {actions[i].desc}
        </div>
      )
    }
    return out
  }

  displayList(list) {
    let out = []
    for(let i in list) {
      out.push(
        <div>{i} {list[i]}</div>
      )
    }
    return out;
  }

  displaySpellSearchResults() {
    let results = this.state.spellResults
    let out = [];
    if(results) {
        for(let i in results) {
          out.push(
            <div class="spellCard">
             <div class="spellCardContainer">
               <h4><b>{results[i].name}</b></h4>
               <p>School: {results[i].school.name}</p>
               <p>Casting Time: {results[i].casting_time}</p>
               <p>Duration: {results[i].duration}</p>
               <p>Range: {results[i].range}</p>
               <p>Description: {results[i].desc}</p>
             </div>
            </div>
          )
        }
    }
    else {
      out.push(<div>No Results Found</div>)
    }
    return out;
  }

  render() {
    return(
      <div style={{"height": "100%"}}>
        <div className="searchContainer">
          <div className="searchBarContainer">
            <input type="text" id="monsterSearch" className="searchBar" placeholder="Monster Search" onChange={this.onChange} value={this.state.monsterSearch}/>
            <button className="DNDSearchButton" onClick={this.monsterSearch}>Search</button>
          </div>
          <div className="searchResultsContainer">
            {this.displayMonsterSearchResults(this.state.monsterResults)}
          </div>
        </div>
        <div className="searchContainer">
          <div className="searchBarContainer">
            <input type="text" id="spellA" className="spellInput" placeholder="Spell Ingredient"/>
            {' '}+{' '}
            <input type="text" id="spellB" className="spellInput" placeholder="Spell Ingredient"/>
            <button className="DNDSearchButton" onClick={this.spellSearch}>Search</button>
          </div>
          <div className="searchResultsContainer">
            {this.displaySpellSearchResults()}
          </div>
        </div>
      </div>
    );
  }

}
export default GameSearch;
