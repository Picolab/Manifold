import React, { useState, useEffect } from 'react';

import Icon from './Icon';
import { getManifoldECI } from '../../../utils/AuthService';
import { customQuery } from '../../../utils/manifoldSDK';
import { styles } from './styles';

const IconSelector = ({search, selected, setSelected}) => {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    customQuery(getManifoldECI(), 'iconfinder', 'getIcons', {query: search} ).then((resp) => {
      setIcons(resp.data);
    });
  }, []);

  const iconList = () => {
    return icons.map((x, i) => {
      let key = search + ' icon ' + i;
      return (<Icon key={key} src={x} alt={key} selected={selected} setSelected={setSelected} />)
    });
  };

  return (
    <div>
      Select an icon:
      <div style={styles.iconList}>
        {iconList()}
      </div>
    </div>
  );
};

export default IconSelector;
