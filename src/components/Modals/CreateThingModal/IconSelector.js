import React, { useState, useEffect } from 'react';

import Icon from './Icon';
import { getManifoldECI } from '../../../utils/AuthService';
import { customQuery } from '../../../utils/manifoldSDK';
import { styles } from './styles';

const IconSelector = ({search, selected, setSelected}) => {
  const [ searchTerm, setSearchTerm ] = useState(search);
  const [ icons, setIcons ] = useState([]);
  const [ button, clickButton ] = useState(0)

  useEffect(() => {
    customQuery(getManifoldECI(), 'io.picolabs.manifold_pico', 'getIcons', { query: searchTerm }).then((resp) => {
      setIcons(resp.data);
    });
  }, [button]);

  const onClick = () => {
    setSelected(null);
    clickButton(button+1);
  }

  const onChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const iconList = () => {
    if (icons.length === 0) {
      return (
        <div style={styles.noResults}>No icons found for '{searchTerm}'. Try another search term above.</div>
      );
    }
    return icons.map((x, i) => {
      let key = search + ' icon ' + i;
      return (<Icon key={key} src={x} alt={key} selected={selected} setSelected={setSelected} />)
    });
  };

  return (
    <div>
      <div>
        <input type="text" placeholder="Find new icons" value={searchTerm} onChange={onChange} /><button type="button" onClick={onClick}>Search</button>
      </div>
      <div style={styles.iconList}>
        {iconList()}
      </div>
    </div>
  );
};

export default IconSelector;
//Test comment
