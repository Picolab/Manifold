import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardGrid from '../../components/Grids/CardGrid';
import CardList from '../../components/CardList/CardList';
import MyThingsHeader from '../../components/MyThingsComponents/MyThingsHeader';
import { getThingIdList } from '../../reducers';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';
import "./MyThings.css";
//import Header from '../../components/Header/Header';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

export class MyThings extends Component {
  state = { thingsSize: 'Grid', dropdownOpen: false, loading: true};

  componentWillUpdate() {
    if(this.props.thingIdList.length > 0 && this.state.loading) {
      this.setState({loading: false})
    }
  }

  renderGrid(){
    this.toggle = this.toggle.bind(this);
    //make sure the things object really exists before trying to display them
    if(this.props.thingIdList.length > 0) {
        if(this.state.thingsSize === 'List') {
          return (
            <div>
              {this.loadDropdown()}
              <CardList idList={this.props.thingIdList}/>
            </div>
          );
        }else{
          return (
            <div>
              <MediaQuery minWidth={600}>
                {this.loadDropdown()}
                <CardGrid idList={this.props.thingIdList} cardType="Thing"/>
              </MediaQuery>
              <MediaQuery maxWidth={599}>
                <CardList idList={this.props.thingIdList}/>
              </MediaQuery>
            </div>
          );
        }
    }else{
      return (
        <div></div>
      )
    }
  }

  loadDropdown() {
    return (
      <div>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} style={{"marginLeft": "10px"}}>
        <DropdownToggle caret>
          {this.state.thingsSize} View
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.changeThingsSize}>{this.state.thingsSize === 'Grid' ? 'List' : 'Grid'}</DropdownItem>
        </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  changeThingsSize = () => {
    if(this.state.thingsSize === 'Grid') {
      this.setState({thingsSize: 'List'});
    }
    else if(this.state.thingsSize === 'List') {
      this.setState({thingsSize: 'Grid'});
    }
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  spinner() {
    return (
      <div>
        <div className="loadingio-spinner-gear-q92uneavp2a-downLeft"><div className="gear-rotate-left">
        <div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div></div>
        <div className="loadingio-spinner-gear-q92uneavp2a-downRight"><div className="gear-rotate-right">
        <div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div></div>
      </div>
    )
  }

  render(){
    return (
      <div>
        <MyThingsHeader />
        {this.state.loading && this.spinner()}
        {this.renderGrid()}
      </div>
    );
  }
}

MyThings.propTypes = {
  thingIdList: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    thingIdList: getThingIdList(state)
  }
}

export default connect(mapStateToProps)(MyThings);
