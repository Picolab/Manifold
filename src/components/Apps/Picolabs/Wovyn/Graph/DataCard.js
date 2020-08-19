import React from 'react'
import './DataCard.css'

class DataCard extends React.Component {
    state = {
        term: this.props.term,
        avgTemp: this.props.avgTemp,
        highTemp: this.props.highTemp
      };

      render() {
        return (
            <div className="card">
              <div className="header">
                {`${this.props.term}:`}
              </div> 
              <h1 className="temp">
                {`${this.props.avgTemp ? this.props.avgTemp : this.props.highTemp}°F` }
              </h1>
            </div>
          );
      }
}

export default DataCard