import React from 'react';

import { styles } from './styles';

const Icon = ({ alt, src, selected, setSelected }) => {

  const getStyle = () => {
    if (src === selected) return {...styles.iconContainer, ...styles.selected};
    else return styles.iconContainer
  }

  return (
    <div onClick={() => { setSelected(src); }} style={getStyle()}>
      <img src={src} alt={alt} style={styles.icon} />
    </div>
  );
}

export default Icon;
