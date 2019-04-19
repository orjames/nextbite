import React from 'react';
import TrashIcon from './images/trash-alt-regular';

const FeedDeletePost = (props: any) => {
  if (props.user.posts.includes(props.post._id)) {
    return (
      <button
        className='fav-button'
        onClick={(e) => props.deletePost(e, props.post._id)}
      >
        <TrashIcon width={'1.3rem'} className='' />
      </button>
    );
  } else {
    return null;
  }
};

export default FeedDeletePost;
