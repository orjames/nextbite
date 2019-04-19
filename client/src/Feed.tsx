import React, { Component } from 'react';
import moment from 'moment';
import { IPost } from './react-app-env';
import FeedCreateComment from './FeedCreateComment';
import FeedImage from './FeedImage';
import FeedFavoriteButton from './FeedFavoriteButton';
import FeedComments from './FeedComments';
import FeedDeletePost from './FeedDeletePost';
import NavIcon from './images/location-arrow-solid';
import FeedText from './FeedText';
import FeedAboveImage from './FeedAboveImage';

const Feed = (props: any) => {
  let posts;
  // rounds distance to 2 places
  const round = roundNumber();
  // calculates distance given input long and lat and stored user long lat
  const distance = calculateDistance(props, round);
  // converts updatedAt time to more readable string
  const dateConverter = convertDate();
  // if there are any posts
  if (props.posts !== null) {
    posts = props.posts.map((post: IPost, index: number) => {
      // console.log(post);

      let tags = post.tags.map((tag: string, index: number) => {
        return (
          <span className='link' key={index}>
            {tag}
          </span>
        );
      });
      return (
        <div className='feed flex column align-flex-start mb-10' key={index}>
          <FeedAboveImage post={post} distance={distance} />
          <FeedImage post={post} />
          <div className='flex row space-between align-center top-buttons'>
            <div className=''>
              <FeedFavoriteButton
                post={post}
                user={props.user}
                removeFromFavorites={props.removeFromFavorites}
                addToFavorites={props.addToFavorites}
              />
              <FeedDeletePost
                post={post}
                user={props.user}
                deletePost={props.deletePost}
              />
            </div>
            <div className='flex row center mr-1'>
              <NavIcon
                width={'1.3rem'}
                fill={'rgb(242, 159, 5)'}
                className='fav-button'
              />
              {distance(post.location.lat, post.location.long)} miles away
            </div>
          </div>
          <FeedText
            dateConverter={dateConverter}
            distance={distance}
            post={post}
            tags={tags}
          />
          <FeedComments post={post} />
          <FeedCreateComment
            user={props.user}
            commenting={props.commenting}
            changeCommenting={props.changeCommenting}
            refreshPosts={props.refreshPosts}
            post={post}
          />
        </div>
      );
    });
  } else {
    posts = <span>no posts</span>;
  }

  return <div>{posts}</div>;
};

export default Feed;

//
//
//
//
//
//
//
//
//
//
//
// local functions
function convertDate() {
  return (date: Date) => {
    let m = moment(date);
    let newDate = m.fromNow();
    return newDate;
  };
}

function calculateDistance(props: any, round: (num: number) => number) {
  return (lat1: number, long1: number) => {
    let lat2 = props.location.lat;
    let long2 = props.location.long;
    let R = 6371e3; // metres
    let φ1 = (lat1 * Math.PI) / 180;
    let φ2 = (lat2 * Math.PI) / 180;
    let Δφ = ((lat2 - lat1) * Math.PI) / 180;
    let Δλ = ((long2 - long1) * Math.PI) / 180;
    let a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;
    d = d / 1609.344; // meters to miles
    d = round(d);
    return d;
  };
}

function roundNumber() {
  return (num: number) => {
    let multiplier = Math.pow(10, 2);
    return Math.round(num * multiplier) / multiplier;
  };
}
