import React from 'react';
import NavIcon from './images/location-arrow-solid';

const FeedAboveImage = (props: any) => {
  return (
    <div className='feed-above-image-div'>
      <div className='company-name-div'>{props.post.company}</div>
      <div className='distance-div'>
        <NavIcon fill={'rgb(242, 159, 5)'} className='fav-button' />
        {props.distance(props.post.location.lat, props.post.location.long)} mi.
      </div>
    </div>
  );
};

export default FeedAboveImage;
