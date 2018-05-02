import React, { Component } from 'react';
import { connect } from 'react-redux';
import ThingGrid from '../../components/Grids/ThingGrid';
import MyThingsHeader from '../../components/MyThingsComponents/MyThingsHeader';

export class MyThings extends Component {
  render(){
    return (
      <div>
        <MyThingsHeader />
        <ThingGrid things={this.props.things}/>
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
