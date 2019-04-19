import React from 'react';
import NavIcon from './images/location-arrow-solid';

const FeedAboveImage = (props: any) => {
  return (
    <div className='flex row space-between align-center top-buttons mb-1'>
      <div className='flex'>
        <span className='bold'>{props.post.company}</span>
      </div>
      <div className='flex row center mr-1'>
        <NavIcon
          width={'1.3rem'}
          fill={'rgb(242, 159, 5)'}
          className='fav-button'
        />
        {props.distance(props.post.location.lat, props.post.location.long)}{' '}
        miles away
      </div>
    </div>
  );
};

export default FeedAboveImage;
