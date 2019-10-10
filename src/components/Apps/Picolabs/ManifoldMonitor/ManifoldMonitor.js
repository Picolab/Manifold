import React from 'react';
import { Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';

import { customQuery } from '../../../../utils/manifoldSDK';
import { getDID } from '../../../../reducers';

class ManifoldMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bar: {
        size: {
          labels: [],
          datasets: [{
            label: 'Size',
            backgroundColor: 'rgba(46,142,229,0.2)',
            borderColor: 'rgba(46,142,229,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(46,142,229,0.4)',
            hoverBorderColor: 'rgba(46,142,229,1)',
            data: []
          }]
        },
        used: {
          labels: [],
          datasets: [{
            label: 'Used',
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            data: []
          }]
        },
        avail: {
          labels: [],
          datasets: [{
            label: 'Available',
            backgroundColor: 'rgba(63,181,178,0.2)',
            borderColor: 'rgba(63,181,178,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(63,181,178,0.4)',
            hoverBorderColor: 'rgba(63,181,178,1)',
            data: []
          }]
        },
        usep: {
          labels: [],
          datasets: [{
            label: 'Use Percentage',
            backgroundColor: 'rgba(254,198,70,0.2)',
            borderColor: 'rgba(254,198,70,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(254,198,70,0.4)',
            hoverBorderColor: 'rgba(254,198,70,1)',
            data: []
          }]
        }
      }
    }
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    customQuery(
      this.props.DID,
      "io.picolabs.manifold_monitor",
      "info",
      null
    ).then((resp) => {
      let bar = this.state.bar;
      for (var i in resp.data) {
        let { size, used, avail, usep, mounted } = resp.data[i];
        bar.size.labels = bar.size.labels.concat(mounted)
        bar.size.datasets[0].data = bar.size.datasets[0].data.concat(size)
        bar.used.labels = bar.used.labels.concat(mounted)
        bar.used.datasets[0].data = bar.used.datasets[0].data.concat(used)
        bar.avail.labels = bar.avail.labels.concat(mounted)
        bar.avail.datasets[0].data = bar.avail.datasets[0].data.concat(avail)
        bar.usep.labels = bar.usep.labels.concat(mounted)
        bar.usep.datasets[0].data = bar.usep.datasets[0].data.concat(usep)
      }
      this.setState({ bar })
    })
  }
  render() {
    return(
      <div>
        <h2 style={{textAlign: "center"}}>Manifold Server Disk Usage</h2>
        <Bar data={this.state.bar.size} height={1} width={5} options={{ maintainAspectRatio: true }}/>
        <Bar data={this.state.bar.used} height={1} width={5} options={{ maintainAspectRatio: true }}/>
        <Bar data={this.state.bar.avail} height={1} width={5} options={{ maintainAspectRatio: true }}/>
        <Bar data={this.state.bar.usep} height={1} width={5} options={{ maintainAspectRatio: true }}/>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    DID: getDID(state, ownProps.picoID)
  }
}

export default connect(mapStateToProps)(ManifoldMonitor)
