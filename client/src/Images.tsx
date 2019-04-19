import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const Images = (props: any) =>
  props.images.map((image: any, index: string) => (
    <div key={index} className='fadein'>
      <div
        onClick={() => props.removeImage(image.public_id)}
        className='delete'
      >
        <FontAwesomeIcon icon={faTimesCircle} size='2x' />
      </div>
      <img
        src={image.secure_url}
        alt=''
        width='330px'
        onError={() => props.onError(image.public_id)}
      />
    </div>
  ));

export default Images;
