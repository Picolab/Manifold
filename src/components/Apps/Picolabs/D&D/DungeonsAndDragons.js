import React from 'react';
import HomeDND from './HomeDND'
import DungeonMasterView from './DungeonMaster/DungeonMasterView'
import "./DungeonsAndDragons.css"
import { displayError } from '../../../../utils/manifoldSDK';

class DungeonsAndDragons extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gameEci: null,
      gameName: null,
      gameRole: null,
      currentPage: "HomeDND"
    };
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.getGameStatus = this.getGameStatus.bind(this);
    this.setGameStatus = this.setGameStatus.bind(this);
  }

  componentDidMount() {
    this.getGameStatus()
  }

  changeCurrentPage(page) {
    this.setState({
      currentPage: page
    })
  }

  getGameStatus() {
    const promise = this.props.manifoldQuery({
      rid: "DND_Game",
      funcName: "getGameStatus"
    });
    promise.then((resp) => {
      if(resp.data.gameEci) {
        this.setGameStatus(resp.data)
      }
    }).catch((e) => {
        displayError(true, "Error getting Game Status.", 404);
    });
  }

  setGameStatus(status) {
    this.setState({
      gameEci: status.gameEci,
      gameName: status.gameName,
      gameRole: status.gameRole,
    });
    if(status.gameRole === "host") {
      this.changeCurrentPage("CreateGame");
    }
  }

  render() {
    if(this.state.currentPage === "HomeDND") {
      return(
        <HomeDND
          manifoldQuery={this.props.manifoldQuery}
          signalEvent={this.props.signalEvent}
          changeCurrentPage={this.changeCurrentPage}
          setGameStatus={this.setGameStatus}
        />
      );
    }
    else if(this.state.currentPage === "CreateGame") {
      return(
        <DungeonMasterView
          manifoldQuery={this.props.manifoldQuery}
          signalEvent={this.props.signalEvent}
          changeCurrentPage={this.changeCurrentPage}
          gameEci={this.state.gameEci}
        />
      );
    }
  }

}
export default DungeonsAndDragons;
