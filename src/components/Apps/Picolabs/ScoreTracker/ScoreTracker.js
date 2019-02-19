import React, { Component } from 'react';
import { Table, Card, CardBody, CardText } from 'reactstrap';

class ScoreTracker extends Component {
  state = {
      participants: [] //array of participants ordered by rank. First position is first place
  }

  componentDidMount() {
    let promise = this.props.manifoldQuery({
      rid: 'io.picolabs.score_tracker',
      funcName: 'currentRanks'
    })
    promise.then((resp) => {
      this.setState({
        participants: resp.data
      })
    }).catch((e) => {
      console.error(e);
    })
  }

  renderRows() {
    let rows = [];
    let prevRank = 1;
    let prevPoints = -1;
    for(var i = 0; i < this.state.participants.length; i++) {
      let current = this.state.participants[i];
      let currentRank = (prevPoints === current.points) ? prevRank : i + 1;
      rows.push(
        <tr key={`scoreTracker${i}`}>
          <th scope="row">{currentRank}</th>
          <td>{`${current.first} ${current.last}`}</td>
          <td>{current.points}</td>
        </tr>
      )
      prevRank = currentRank;
      prevPoints = current.points;
    }
    return rows;
  }

  render() {
    return (
      <div>
        <Card>
          <CardBody style={{width: '95%', margin: '25px auto'}}>
            <h1 style={{textAlign: 'center', marginBottom: '10px'}}>Score Tracker</h1>
            <h3>Leaderboard</h3>
            <Table hover>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Participant</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderRows()}
                </tbody>
              </Table>
              <CardText>Icon made by <a href="https://www.flaticon.com/authors/freepik">Freepik</a> from www.flaticon.com</CardText>
          </CardBody>
        </Card>
      </div>
    )
  }
}

export default ScoreTracker;
