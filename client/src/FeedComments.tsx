import React from 'react';
import moment from 'moment';
import { CommentInterface } from './types/react-app-env';

const FeedComments = (props: any) => {
  let comments;
  let commentsData = props.post.comments;
  if (commentsData.length) {
    comments = commentsData.map((comment: CommentInterface, index: number) => {
      return (
        <div key={index} className="comment">
          <span className='bold'>{comment.user}</span> {comment.body}{' '}
          <span className='lighter'>{convertDate(comment.updatedAt)}</span>
        </div>
      );
    });
  } else {
    comments = <div>no comments</div>;
  }

  return <div className='comments-div'>{comments}</div>;
};

export default FeedComments;

function convertDate(date: Date) {
  let m = moment(date);
  let newDate = m.fromNow();
  return newDate;
}
