import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardGrid from '../../components/Grids/CardGrid';
import MyThingsHeader from '../../components/MyThingsComponents/MyThingsHeader';
import { getThingIdList } from '../../reducers';

export class MyThings extends Component {
  renderGrid(){
    //make sure the things object really exists before trying to display them
    if(this.props.thingIdList.length > 0){
      return (
        <CardGrid idList={this.props.thingIdList} cardType="Thing"/>
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
  return {
    thingIdList: getThingIdList(state)
  }
}

export default connect(mapStateToProps)(MyThings);
