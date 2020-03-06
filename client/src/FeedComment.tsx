import React, { useState } from 'react';
import axios from 'axios';
import CommentIcon from './images/comment-regular';
import CloseIcon from './images/window-close-regular';
import CommentForm from './CommentForm';
import { PostInterface, UserInterface } from './types/react-app-env'

interface Props {
  user: UserInterface;
  refreshPosts: (postData: PostInterface[]) => void;
  post: PostInterface;
}

export const  FeedComment = (props: Props) => {
  const [commenting, setCommenting] = useState<boolean>(false);

  const changeCommenting = () => {
    setCommenting(!commenting)
  }

  return (
    <div className='comment-button-div'>
      <button
        className='fav-button below-image-button'
        onClick={changeCommenting}
      >
        <CommentIcon width={'1.3rem'} />
      </button>
        <CommentForm
          user={props.user}
          commenting={commenting}
          changeCommenting={changeCommenting}
          refreshPosts={props.refreshPosts}
          post={props.post}
        />
    </div>
  )
}
