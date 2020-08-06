import React, { useState } from 'react';
import axios from 'axios';

const IconSelector = ({search}) => {
  const [icons, setIcons] = useState('');

  const fetchIcons = () => {
    axios.get(`https://api.iconfinder.com/v4/icons/search?query=${search}&count=5&premium=0`,
      { headers: {
          authorization: 'Bearer wX5kw7qHDKJvFRzWtY2qvYM1CoWLD7oyQiLcXD7B0YgnJqwIxU1IggOlJDNvT3RH'
        }
      }).then((resp) => {
        console.log(resp.data);
      });
  };
  fetchIcons();
  return (
    <div>
      Beto Likes Big Weennies!!!!
    </div>
  );
};

export default IconSelector;
