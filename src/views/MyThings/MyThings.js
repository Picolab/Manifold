import React, { Component } from 'react';
import { createThing, moveThing } from '../../utils/manifoldSDK';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, ButtonGroup } from 'reactstrap';
import _ from 'lodash';
import { connect } from 'react-redux';
import Thing from '../../components/ThingCard/Thing';
import ManifoldSearch from '../../components/ManifoldSearch/ManifoldSearch';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


class MyThings extends Component {
  constructor(props) {
    super(props);
    //console.log("THE PROPS!!!!",props);
    this.state = {
      addModal: false,
      registerRulesetModal: false,
      searchOptionsModal: false,
      name: "",
      data: [],
      searchValue: "",
      cSelected: []

    }
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.generateSearchContent = this.generateSearchContent.bind(this);
    //handlers
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleRegisterRulesetClick = this.handleRegisterRulesetClick.bind(this);
    this.handleSearchOptionsClick = this.handleSearchOptionsClick.bind(this);
    this.handleSearchSuggestionClick = this.handleSearchSuggestionClick.bind(this);
    //render components
    this.renderAddModal = this.renderAddModal.bind(this);
    this.renderRegisterRulesetModal = this.renderRegisterRulesetModal.bind(this);
    this.renderCards = this.renderCards.bind(this);
    this.renderSearchbar = this.renderSearchbar.bind(this);
    //toggles
    this.toggleRegisterRulesetModal = this.toggleRegisterRulesetModal.bind(this);
    this.toggleAddModal = this.toggleAddModal.bind(this);
    this.toggleSearchOptionsModal = this.toggleSearchOptionsModal.bind(this);
    this.onCheckboxBtnClick = this.onCheckboxBtnClick.bind(this);
  }

  handleSearchSuggestionClick(suggestion){
    console.log("CLICKED TOP LEVEL: ", suggestion)
    this.setState({searchValue: suggestion})
    //, () => {console.log("SEARCHED")}
  }

  handleSearchOptionsClick(){
    this.toggleSearchOptionsModal();
  }

  handleRegisterRulesetClick(){
    //const appURL = this.props.url;
    this.toggleRegisterRulesetModal();
    //this.props.dispatch({type: "command", command: registerRuleset, params: [appURL]});
  }

  handleAddClick(){
    const newName = this.state.name;
    this.toggleAddModal();
    this.props.dispatch({
      type: "command",
      command: createThing,
      params: [newName],
      query: { type: 'MANIFOLD_INFO'}
    });
  }

  toggleSearchOptionsModal(){
    this.setState({
      searchOptionsModal: !this.state.searchOptionsModal
    });
  }

  toggleRegisterRulesetModal(){
    this.setState({
      registerRulesetModal: !this.state.registerRulesetModal
    });
  }

  toggleAddModal() {
    this.setState({
      addModal: !this.state.addModal,
      name: "" // this will reset the name when you navigate away from the add thing modal
    });
  }



  updateLayout(layout) {
    for (var thing of layout) {
      var comp = this.state.layout[thing.i];
      if (!comp ||
        thing.x !== comp.x || thing.y !== comp.y ||
        thing.w !== comp.w || thing.h !== comp.h) {

        var thingName = this.props.things[thing.i].name;
        this.props.dispatch({
          type: "command",
          command: moveThing,
          params: [thingName, thing.x, thing.y, thing.w, thing.h],
          query: { type: 'MANIFOLD_INFO'}
        });
      }
    }
  }

  onLayoutChange(layout) {
    //this.props.onLayoutChange(layout);
    if (!this.state.layout || this.state.layout.length === 0) {
      this.setState({layout: layout});
      return;
    }
    this.updateLayout(layout);
    this.setState({layout: layout});
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onCheckboxBtnClick(selected) {
    const index = this.state.cSelected.indexOf(selected);
    if (index < 0) {
      this.state.cSelected.push(selected);
    } else {
      this.state.cSelected.splice(index, 1);
    }
    this.setState({ cSelected: [...this.state.cSelected] });
  }

  renderThing(el) {
    return (
      <div key={el.key} data-grid={el} >
          <Thing name={el.name} id={el.id} color={el.color} parent_eci={el.parent_eci} eci={el.eci} />
      </div>
    );
  }

  renderCards(){
    //First, find if any cards should be filtered from the search bar
    let filteredCardList = [];
    let searchValue = this.state.searchValue;
    if(this.props.things !== undefined){
      this.props.things.forEach(function(thing){
        if(searchValue !== ""){
          if(thing.name === searchValue){
            filteredCardList.push(thing);
          }
        }
        else{
          filteredCardList.push(thing);
        }
      })

      return(
        _.map(filteredCardList,this.renderThing)
      )

    }
  }

  generateSearchContent(){
    //generate the Search Content from which the Search bar can get autosuggestions
    let searchContent;
    searchContent = [];
    if(this.props.things){
      for(var i = 0; i < this.props.things.length; i+=1){
        searchContent = searchContent.concat(this.props.things[i].name)
      }
    }
    return searchContent
  }

  renderSearchbar(){
    var searchContent = this.generateSearchContent()
    return(
      <ManifoldSearch
        searchsuggestionClicked={this.handleSearchSuggestionClick}
        searchContent={searchContent}
        searchOptionsClicked={this.handleSearchOptionsClick}
      />
    )
  }

  renderSearchOptionsModal(){
    return(
      <Modal isOpen={this.state.searchOptionsModal} toggle={this.toggleSearchOptionsModal} className={'modal-primary'}>
        <ModalHeader toggle={this.toggleSearchOptionsModal}>Search Options</ModalHeader>
        <ModalBody>
          <h5>Checkbox Buttons</h5>
            <ButtonGroup>
              <Button color="primary" onClick={() => this.onCheckboxBtnClick(1)} active={this.state.cSelected.includes(1)}>One</Button>
              <Button color="primary" onClick={() => this.onCheckboxBtnClick(2)} active={this.state.cSelected.includes(2)}>Two</Button>
              <Button color="primary" onClick={() => this.onCheckboxBtnClick(3)} active={this.state.cSelected.includes(3)}>Three</Button>
            </ButtonGroup>
        <p>Selected: {JSON.stringify(this.state.cSelected)}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleSearchOptionsClick}>Apply Changes</Button>{' '}
          <Button color="secondary" onClick={this.toggleSearchOptionsModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }

  renderAddModal() {
    return(
      <Modal isOpen={this.state.addModal} toggle={this.toggleAddModal} className={'modal-primary'}>
        <ModalHeader toggle={this.toggleAddModal}>Create a new Thing</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> New Thing's name</label>
            <input type="text" className="form-control" id="name" placeholder="THING NAME" onChange={(element) => this.setState({ name: element.target.value})}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleAddClick}>Create Thing</Button>{' '}
          <Button color="secondary" onClick={this.toggleAddModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }

  renderRegisterRulesetModal(){
    return(
      <Modal isOpen={this.state.registerRulesetModal} toggle={this.toggleRegisterRulesetModal} className={'modal-info'}>
        <ModalHeader toggle={this.toggleRegisterRulesetModal}>Register a new Ruleset</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <label> App url to register: </label>
            <input type="text" className="form-control" id="url" placeholder="Lord Sauron" onChange={(element) => this.setState({ url: element.target.value})}/>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="info" onClick={this.handleRegisterRulesetClick}>Register it</Button>{' '}
          <Button color="secondary" onClick={this.toggleRegisterRulesetModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    )
  }

  render(){
    //MAIN RENDER FUNCTION
    return (
      <div>
        <div style={{height:"30px"}}>
          <button style={{float:"right"}} className="btn btn-primary" onClick={() => this.toggleAddModal()}>+</button>
          <button style={{float:"right"}} className="btn btn-warning" onClick={() => this.toggleRegisterRulesetModal()}>R</button>
        </div>
        {this.renderAddModal()}
        {this.renderRegisterRulesetModal()}
        {this.renderSearchOptionsModal()}
        {this.renderSearchbar()}
        <div>
          <ResponsiveReactGridLayout {...this.props}
            onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}>
              {this.renderCards()}
          </ResponsiveReactGridLayout>
        </div>

      </div>

    );
  }
}

MyThings.defaultProps = {
  className: "layout",
  cols: {lg: 12, md: 10, sm: 6, xs: 4, xxs: 2},
  rowHeight: 100
};

function addPropsToThings(thingsArray){
  for (var thing of thingsArray.things) {
    thing.pos = thingsArray.thingsPosition[thing.name] || {"x":0, "y":0, "w":3, "h":2.25, "minW":3, "minH":2.25, "maxW":8, "maxH":5};
    //thing.color = thingsArray.thingsColor[thing.name] || {"color": "#eceff1"}
  }
  return thingsArray.things.map(function(i, key, list) {
    return {
      key: key.toString(),
      x: i.pos.x, y: i.pos.y, w: i.pos.w, h: i.pos.h,
      minW: i.pos.minw, minH: i.pos.minh, maxW: i.pos.maxw, maxH: i.pos.maxh,
      //color: i.color.color,
      name: i.name, id: i.id, eci: i.eci, parent_eci: i.parent_eci};
  })
};

const mapStateToProps = state => {
  if(state.manifoldInfo.things){
    return {
      things: addPropsToThings(state.manifoldInfo.things)
    }
  }else{
    return {}
  }
}


export default connect(mapStateToProps)(MyThings);
