import React from 'react';
import ReactDOM from 'react-dom';
import Full from './Full';

import { shallow } from 'enzyme';

describe("Full component", () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Full />);
  });
})
