import React from 'react';
import moment from 'moment';

const FeedText = (props: any) => {
  return (
    <div className='flex column flex-start align-flex-start'>
      <div className='flex'>
        <span className='bold mr-1'>{props.post.company}</span>
        {props.post.caption}
      </div>
      <div className='flex lighter'>
        {props.dateConverter(props.post.updatedAt)}
      </div>
      <div className='flex'>{props.tags}</div>
    </div>
  );
};

export default FeedText;

function convertDate(date: Date) {
  let m = moment(date);
  let newDate = m.fromNow();
  return newDate;
}
