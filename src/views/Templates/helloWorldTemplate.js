import React, { Component } from 'react';
import { connect } from 'react-redux';

class HelloWorldTemplate extends Component {



  render(){
    return (
      <div>
        HELLO WORLDZY
      </div>
    );
  }
}

const mapStateToProps = state => {
  if(state.identities){
    return {
       identities: state.identities
    }
  }else{
    return {}
  }
}

export default connect(mapStateToProps)(HelloWorldTemplate);
