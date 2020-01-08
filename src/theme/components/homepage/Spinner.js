import React from 'react';
import { Icon } from 'react-fa';

const Spinner = ({ shown }) => {
  const iconStyle = {
    color: 'white', 
    textAlign: 'center',
    width: '100%', 
    fontSize: '30px'
  };

  if (!shown) return <div />;

  return <Icon style={iconStyle} spin name="spinner" />;
};

export default Spinner;
