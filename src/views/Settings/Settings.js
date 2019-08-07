import React from 'react';
import { connect } from 'react-redux';
import { getThingIdList } from '../../reducers';
import {Table} from 'reactstrap';
import ThingsList from './ThingsList';

class Settings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

    };


  }

  componentDidMount() {
    console.log(this.props.thingIdList);
  }

  displayThings() {
    return (
      <div>
        <Table>
          <tbody>
            <ThingsList idList={this.props.thingIdList}/>
          </tbody>
        </Table>
      </div>
    );
  }
  render(){
    return (
      <div style={{"maxWidth":"600px"}}>
        <h1>Settings</h1>
        <hr className="my-2" style={{"paddingBottom":"5px"}}/>
        <h2>My Things</h2>
        {this.displayThings()}

      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    thingIdList: getThingIdList(state)
  }
}
export default connect(mapStateToProps)(Settings);
