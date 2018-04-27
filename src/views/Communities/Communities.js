import React, { Component } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { connect } from 'react-redux';
import Community from './Community';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class Communities extends Component {
  constructor(props) {
    super(props);
    //Following functions handle community card UI updates
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.updateLayout = this.updateLayout.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.state = {
      fakeTestCommunities: //dummy data used until the Pico-Engine can handle Community API requests
      [
        {"collectionName": "Garage",
        "collection": [
          {"name": "Garage Door", "state": "off"},
          {"name": "Shop vac", "state": "off"},
          {"name": "Garage Door #2", "state": "off"},
          {"name": "Shop vac #2", "state": "off"}
        ]},
        {"collectionName": "Kitchen",
        "collection": [
          {"name": "Fridge", "state": "on"},
          {"name": "Fan", "state": "on"}
        ]}
      ],
    }
  }

  onLayoutChange(layout) {
    if (!this.state.layout || this.state.layout.length === 0) {
      this.setState({layout: layout});
      return;
    }
    this.updateLayout(layout);
    this.setState({layout: layout});
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  updateLayout(layout) {
    for (var thing of layout) {
      var comp = this.state.layout[thing.i];
      if (!comp ||
        thing.x !== comp.x || thing.y !== comp.y ||
        thing.w !== comp.w || thing.h !== comp.h) {
      }
    }
  }

  render(){
    //First, generate a list of all discovered communities (currently pulling from dummy data only)
    let communityCards;
    communityCards = this.state.fakeTestCommunities.map((item, i) => {
      return(
        <div key={i}>
          <Community picos={item}/>
        </div>
      );
    });
    return (
      <div>
        <div>
          Communities Page
        </div>
        <div>
          <ResponsiveReactGridLayout {...this.props} onLayoutChange={this.onLayoutChange}
            onBreakpointChange={this.onBreakpointChange}>

            {communityCards}

          </ResponsiveReactGridLayout>
        </div>

    </div>
    );
  }
}

const mapStateToProps = state => {
  return {}
}


export default connect(mapStateToProps)(Communities);
