import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

const Spinner = () => (
  <div className='rolling'>
    <div className='spinner fadein'>
      <FontAwesomeIcon icon={faUtensils} size='5x' color='rgb(242, 159, 5)' />
    </div>
  </div>
);

export default Spinner;
