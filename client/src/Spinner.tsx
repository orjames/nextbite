import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog } from '@fortawesome/free-solid-svg-icons';

const Spinner = () => (
  <div className='rolling'>
    <div className='spinner fadein'>
      <FontAwesomeIcon icon={faDog} size='5x' color='#1D3C4C' />
    </div>
  </div>
);

export default Spinner;
