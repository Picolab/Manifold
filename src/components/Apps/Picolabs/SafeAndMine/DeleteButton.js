import React, { Component } from 'react';
import { UncontrolledTooltip } from 'reactstrap';

export default class DeleteButton extends Component {
  render() {
    return (
      <div className="inline">
        <div style={{"display" : "inline"}} onClick={() => {
          const promise = this.props.signalEvent({
            domain : "safeandmine",
            type : "deregister",
            attrs : { tagID : this.props.tagID, domain : this.props.domain }
          })
          promise.then(() => {
            this.props.retrieveTags();
          })
        }}>
          <i id={"nada"} className="fa fa-trash float-right fa-lg manifoldDropdown" />
        </div>
        <UncontrolledTooltip placement="bottom" delay={300} target={"nada"}>
          Remove Tag
        </UncontrolledTooltip>
      </div>
    );
  }
}
