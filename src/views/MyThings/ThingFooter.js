import React, { Component} from 'react';
import ThingFooterItem from './ThingFooterItem';

class ThingFooter extends Component{
  handleDotClick(index){
    this.props.dotClicked(index);
  }

  render(){
    let footerItems;
    if(this.props.installedApps){
      var index = -1
      footerItems = this.props.installedApps.map(app => {
        index+=1
        return(
          <ThingFooterItem onDotClick={this.handleDotClick.bind(this)} key={app.meta.rid} app={app} index={index} currentApp={this.props.currentApp}/>
        );
      });
    }


    return(
      <div className="card-footer" style={{"background-color": this.props.color, overflow:"hidden",  textAlign: "center", minHeight:"40px"}}>
        <span>
          {footerItems}
        </span>
      </div>
    );
  }
}

export default ThingFooter;
