import React from 'react';
import './MirrorDisplay.css';
import CardMap from '../../../Apps/CardMap';
import ManifoldApp from '../../../Apps/ManifoldApp';

class MirrorDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tl: "",
      tr: "",
      bl: "",
      br: "",
    }
  }
  componentDidMount() {
    console.log("card map", CardMap);
    let url_string = window.location.href.replace("#/", "")
    let url = new URL(url_string);
    let tl = url.searchParams.get("tl");
    let tr = url.searchParams.get("tr");
    let bl = url.searchParams.get("bl");
    let br = url.searchParams.get("br");

    this.setState({ tl, tr, bl, br });
  }

  determineOrientation() {
    const { tl, tr, bl, br } = this.state;
    if (tl === tr || bl === br) {
      return "row";
    }
    else if (tl === bl || tr === br) {
      return "column"
    }
    return "";
  }

  getAppDisplay(app) {
    return <div>{app}</div>
  }

  renderDisplay() {
    const { tl, tr, bl, br } = this.state
    console.log(this.state);
    const orientation = this.determineOrientation()
    if (orientation === "row") {
      return (
        <div className="preview-container">
          {(tl === tr) && <div className="preview-top-row">{this.getAppDisplay(tl)}</div>}
          {!(tl === tr) && <div className="preview-item left">{this.getAppDisplay(tl)}</div>}
          {!(tl === tr) && <div className="preview-item right">{this.getAppDisplay(tr)}</div>}

          {(bl === br) && <div className="preview-bottom-row">{this.getAppDisplay(bl)}</div>}
          {!(bl === br) && <div className="preview-item left">{this.getAppDisplay(bl)}</div>}
          {!(bl === br) && <div className="preview-item right">{this.getAppDisplay(br)}</div>}
        </div>
      );
    }
    else if (orientation === "column") {
      return (
        <div className="preview-container">
          {(tl === bl) && <div className="preview-left-column">{this.getAppDisplay(tl)}</div>}
          {!(tl === bl) && <div className="preview-item left">{this.getAppDisplay(tl)}</div>}
          {!(tl === bl) && <div className="preview-item left">{this.getAppDisplay(bl)}</div>}

          {(tr === br) && <div className="preview-right-column">{this.getAppDisplay(tr)}</div>}
          {!(tr === br) && <div className="preview-item right">{this.getAppDisplay(tr)}</div>}
          {!(tr === br) && <div className="preview-item right">{this.getAppDisplay(br)}</div>}
        </div>
      );
    }
    return (
      <div className="preview-container">
        <div className="preview-item left">{this.getAppDisplay(tl)}</div>
        <div className="preview-item right">{this.getAppDisplay(tr)}</div>
        <div className="preview-item left">{this.getAppDisplay(bl)}</div>
        <div className="preview-item right">{this.getAppDisplay(br)}</div>
      </div>
    );
  }

  render() {
    return (
      <div className="mirror-display">
        {this.renderDisplay()}
      </div>
    );
  }
}
export default MirrorDisplay;
