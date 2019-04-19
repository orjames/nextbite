import React from 'react';
import HeartEmptyIcon from './images/heart-empty';
import HeartSolidIcon from './images/heart-solid';

const FeedFavoriteButton = (props: any) => {
  // if viewing favorites
  // conditionally rendering favorites button
  if (props.user.favorites) {
    if (props.user.favorites.includes(props.post._id)) {
      // if post is contained in user.favorites
      return (
        <button
          className='fav-button un-fav-button'
          onClick={() => props.removeFromFavorites(props.post)}
        >
          <HeartSolidIcon width={'1.3rem'} className='' />
        </button>
      );
    } else {
      return (
        <button
          className='fav-button'
          onClick={() => props.addToFavorites(props.post)}
        >
          <HeartEmptyIcon width={'1.3rem'} className='' />
        </button>
      );
    }
  } else {
    return (
      <button
        className='fav-button'
        onClick={() => props.addToFavorites(props.post)}
      >
        <HeartEmptyIcon width={'1.3rem'} className='' />
      </button>
    );
  }
};

export default FeedFavoriteButton;
