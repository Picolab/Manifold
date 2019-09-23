import React, { Component } from 'react';
import { UncontrolledCarousel } from 'reactstrap';
import './Help.css';

const items = [
  {
    src: 'https://s15.postimg.cc/5pduf4xx7/Help0.png',
    altText: "Slide 1",
    caption: " "
  },
  {
    src: 'https://s15.postimg.cc/r40mm5gsb/Help1.png',
    altText: "Slide 2",
    caption: " "
  },
  {
    src: 'https://s15.postimg.cc/qjllj9d7f/Help2.png',
    altText: "Slide 3",
    caption: " "
  },
  {
    src: 'https://s15.postimg.cc/wykmfrzaz/Help3.png',
    altText: "Slide 4",
    caption: " "
  },
  {
    src: 'https://s15.postimg.cc/5nzb7w6or/Help4.png',
    altText: "Slide 5",
    caption: " "
  },
  {
    src: 'https://s15.postimg.cc/4j9ugprqj/Help5.png',
    altText: "Slide 6",
    caption: " "
  },
  {
    src: 'https://s15.postimg.cc/xyfipq3zv/Help6.png',
    altText: "Slide 7",
    caption: " "
  },
  {
    src: 'https://s15.postimg.cc/6b2tbmqiz/Help7.png',
    altText: "Slide 8",
    caption: " "
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
