import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardGrid from '../../components/Grids/CardGrid';
import MyThingsHeader from '../../components/MyThingsComponents/MyThingsHeader';

export class MyThings extends Component {
  renderGrid(){
    //make sure the things object really exists before trying to display them
    if(this.props.things.things){
      return (
        <CardGrid objects={this.props.things.things} objPositions={this.props.things.thingsPosition} objColors={this.props.things.thingsColor} cardType="Thing"/>
      )
    }else{
      return (
        <div></div>
      )
    }
  }

  render(){
    return (
      <div>
        <MyThingsHeader />
        {this.renderGrid()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  if(state.manifoldInfo.things){
    return {
      things: state.manifoldInfo.things
    }
  }else{
    return {
      things: {}
    }
  }
}

export default connect(mapStateToProps)(MyThings);
