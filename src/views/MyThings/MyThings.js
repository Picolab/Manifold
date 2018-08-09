import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardGrid from '../../components/Grids/CardGrid';
import CardList from '../../components/CardList/CardList';
import MyThingsHeader from '../../components/MyThingsComponents/MyThingsHeader';
import { getThingIdList } from '../../reducers';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';

export class MyThings extends Component {
  renderGrid(){
    //make sure the things object really exists before trying to display them
    if(this.props.thingIdList.length > 0) {
      return (
        <div>
          <MediaQuery minWidth={1224}>
            <CardGrid idList={this.props.thingIdList} cardType="Thing"/>
          </MediaQuery>

          <MediaQuery maxWidth={1223}>
            <CardList idList={this.props.thingIdList}/>
          </MediaQuery>
        </div>
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

MyThings.propTypes = {
  thingIdList: PropTypes.array.isRequired
}

const mapStateToProps = state => {
  return {
    thingIdList: getThingIdList(state)
  }
}

export default connect(mapStateToProps)(MyThings);
