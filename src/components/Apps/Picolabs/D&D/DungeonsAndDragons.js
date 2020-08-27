import React from 'react';
import HomeDND from './HomeDND'
import CreateGame from './CreateGame'
import "./DungeonsAndDragons.css"

class DungeonsAndDragons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPage: "CreateGame"
    };
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
  }

  changeCurrentPage(page) {
    this.setState({
      currentPage: page
    })
  }

  render() {
    if(this.state.currentPage === "HomeDND") {
      return(
        <HomeDND
          manifoldQuery={this.props.manifoldQuery}
          signalEvent={this.props.signalEvent}
          changeCurrentPage={this.changeCurrentPage}
        />
      );
    }
    else if(this.state.currentPage === "CreateGame") {
      return(
        <CreateGame
          signalEvent={this.props.signalEvent}
          changeCurrentPage={this.changeCurrentPage}
        />
      );
    }
  }

}
export default DungeonsAndDragons;
