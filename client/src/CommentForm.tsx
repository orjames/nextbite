import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames'
import CloseIcon from './images/window-close-regular';
import { UserInterface, PostInterface } from './types/react-app-env';

interface Props {
  user: UserInterface;
  commenting: boolean;
  changeCommenting: () => void;
  refreshPosts: (postData: PostInterface[]) => void;
  post: PostInterface;
}

const CommentForm = (props: Props) => {
  let [commentBody, setCommentBody] = useState<string>('');

  const handleSubmit = (e: any, postId: string) => {
    e.preventDefault();
    axios
      .post(`/api/posts/${postId}/comments`, {
        body: commentBody,
        user: props.user.firstName + ' ' + props.user.lastName
      })
      .then(res => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          props.refreshPosts(res.data);
        }
      })
      .then(() => {
        props.changeCommenting();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <div className={classNames('comment-form-div', { hidden: !props.commenting})}>
      <form onSubmit={(e: any) => handleSubmit(e, props.post._id)}>
        <div className='comment-button-div'>
          <button
            className='fav-button below-image-button'
            value='cancel'
            onClick={() => props.changeCommenting()}
          >
            <CloseIcon width={'1.3rem'} />
          </button>
        </div>
        <div className='comment-input-container'>
          <input
            onChange={e => setCommentBody(e.target.value)}
            value={commentBody}
            name='comment-body'
            id='comment-body'
            className='input'
            type='text'
            pattern='.+'
            required
          />
          <label className='comment-label' htmlFor='comment-body'>
            comment
          </label>
        </div>
      </form>
    </div>
    );
}

export default CommentForm;
