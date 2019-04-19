import React from 'react';
import moment from 'moment';
import { IComment } from './react-app-env';

const FeedComments = (props: any) => {
  let comments;
  let commentsData = props.post.comments;
  if (commentsData.length) {
    comments = commentsData.map((comment: IComment, index: number) => {
      return (
        <div key={index}>
          <span className='bold'>{comment.user}</span> {comment.body}{' '}
          <span className='lighter'>{convertDate(comment.updatedAt)}</span>
        </div>
      );
    });
  } else {
    comments = <div>no comments</div>;
  }

  return <div className='ml-2'>{comments}</div>;
};

export default FeedComments;

function convertDate(date: Date) {
  let m = moment(date);
  let newDate = m.fromNow();
  return newDate;
}
