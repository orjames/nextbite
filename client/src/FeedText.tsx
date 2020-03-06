import React from 'react';
import moment from 'moment';

const FeedText = (props: any) => {
  return (
    <div className='feed-post-text-div'>
      <div className='company-and-caption'>
        <span className='company-name'>{props.post.company}</span>
        <span className='caption'>{props.post.caption}</span>
      </div>
      <div className='date'>
        {props.dateConverter(props.post.updatedAt)}
      </div>
      <div className='tags'>{props.tags}</div>
    </div>
  );
};

export default FeedText;