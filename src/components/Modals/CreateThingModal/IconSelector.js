import React, { useState } from 'react';
import { ICON_API_KEY } from '../../../utils/config';
import axios from 'axios';

const IconSelector = ({search}) => {
  const [icons, setIcons] = useState('');

  const fetchIcons = () => {
    axios.get(`https://api.iconfinder.com/v4/icons/search?query=${search}&count=5&premium=0`,
      { headers: {
          authorization: `Bearer ${ICON_API_KEY}`
        }
      }).then((resp) => {
        console.log(resp.data);
      });
  };
  fetchIcons();
  return (
    <div>
      Beto loves and respects everyone regardless of race, nationality, religion, and sexual orientation. He also promises to not type anything sketchy over teletype so that it looks like Jace wrote it in the git commits
    </div>
  );
};

export default IconSelector;
//Test comment
