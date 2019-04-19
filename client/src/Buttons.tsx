import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export default (props: any) => (
  <div className='buttons fadein'>
    <div className='button'>
      <label htmlFor='uploader'>
        <FontAwesomeIcon icon={faImage} color='rgb(170,56,30)' size='10x' />
      </label>
      <input type='file' id='uploader' onChange={props.upload} />
    </div>
  </div>
);
