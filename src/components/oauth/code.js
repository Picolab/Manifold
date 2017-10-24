import { Component } from 'react';
import { getState } from '../../utils/AuthService';
import { connect } from 'react-redux';
import { getAccessToken } from '../../actions';
import queryString from 'query-string';


class Code extends Component {
  handleCodeRoute(){
    const unparsedQuery = this.props.location.search;
    const { code, state } = queryString.parse(unparsedQuery);
    console.log(code,state);
    const expectedState = getState();
    console.log("expectedState:", expectedState);
    if (state !== expectedState) {
      console.warn("OAuth Security Warning. Client states do not match. (Expected %d but got %d)", expectedState, state);
      return;
    }
    this.props.getAccessToken(code);
  }

  componentDidMount(){
    this.handleCodeRoute();
  }

  render(){
    return null;
  }
}

export default connect(null, {getAccessToken})(Code); //binds the action function getAccessToken to the redux store/reducers
