import React, { Component } from 'react';
import { UncontrolledCarousel } from 'reactstrap';
import './Help.css';

const items = [
  {
    src: 'https://s15.postimg.cc/5pduf4xx7/Help0.png'
  },
  {
    src: 'https://s15.postimg.cc/r40mm5gsb/Help1.png'
  },
  {
    src: 'https://s15.postimg.cc/qjllj9d7f/Help2.png'
  },
  {
    src: 'https://s15.postimg.cc/wykmfrzaz/Help3.png'
  },
  {
    src: 'https://s15.postimg.cc/5nzb7w6or/Help4.png'
  },
  {
    src: 'https://s15.postimg.cc/4j9ugprqj/Help5.png'
  },
  {
    src: 'https://s15.postimg.cc/xyfipq3zv/Help6.png'
  },
  {
    src: 'https://s15.postimg.cc/6b2tbmqiz/Help7.png'
  }

];

export default class Help extends Component {
  render() {
    return(
      <div>
        <UncontrolledCarousel interval={false} items={items} />
      </div>
    );
  }

}
