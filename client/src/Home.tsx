import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Feed from './Feed';
import classNames from 'classnames';
import { PostInterface, LocationInterface, UserInterface, FeedOptions } from './types/react-app-env'

interface Props {
  userProp: UserInterface;
  userLocation: LocationInterface;
  logout: () => void;
  checkForLocalToken: () => void;
}

export const Home = (props: Props) => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  let [feedToggle, setFeedToggle] = useState<FeedOptions>(FeedOptions.Feed);
  const [favorites, setFavorites] = useState<PostInterface[]>([]);
  const user = useState<UserInterface>()

  useEffect(() => {
    // getting all posts
    axios
      .get('/api/posts')
      .then((res: any) => {
        setPosts(res.data)
      })
      .then(() => {
        axios.get(`/api/users/${props.userProp._id}`).then((res: any) => {
          console.log(res.data.favorites)
          setFavorites(res.data.favorites ? res.data.favorites : [])
        });
      });
  }, [])

  // change feed to view favorites or feed
  const changeFeed = (feedChange: FeedOptions) => {
    if (feedToggle !== feedChange) {
      setFeedToggle(feedChange)
    }
  };

  const refreshPosts = (postData: PostInterface[]) => {
    setPosts(postData)
  };

  const deletePost = (e: React.MouseEvent, pid: string) => {
    console.log('\x1b[32m', 'in deletePost', pid);
    e.preventDefault();
    let userId = props.userProp._id;
    axios
      .delete(`/api//users/${userId}/posts/${pid}`, {})
      .then(res => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          refreshPosts(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // add to favorites
  const addToFavorites = (post: PostInterface) => {
    console.log(user)
    favorites.push(post);
    axios
      .put(`/api/users/${props.userProp._id}/favorite`, { favorites })
      .then(res => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          console.log('\x1b[32m', 'res.data:');
          console.log(res.data);
          setFavorites(res.data.favorites)
        }
      })
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        props.checkForLocalToken();
      });
  };

  // remove from favorites
  const removeFromFavorites = (inputPost: PostInterface) => {
    let filteredFavorites = [];
    filteredFavorites = favorites.filter((post: PostInterface) => {
      return post.publicId !== inputPost.publicId;
    });
    axios
      .put(`/api/users/${props.userProp._id}/favorite`, { filteredFavorites })
      .then(res => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          setFavorites(res.data.favorites)
        }
      })
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        props.checkForLocalToken();
      });
  };

  const generateToggle = (feedToggle: FeedOptions) => {
    return (
      <div className='toggle-container'>
        <button
          className={classNames('toggle-button', {
            selected: feedToggle === FeedOptions.Feed
          })}
          onClick={() => changeFeed(FeedOptions.Feed)}
        >
          feed
        </button>
        <button
          className={classNames('toggle-button', {
            selected: feedToggle === FeedOptions.Favorites
          })}
          onClick={() => changeFeed(FeedOptions.Favorites)}
        >
          favorites
        </button>
      </div>
    );
  };
  return (
    <div className='app-home-div'>
      {generateToggle(feedToggle)}
      <Feed
        feedToggle={feedToggle}
        location={props.userLocation}
        addToFavorites={addToFavorites}
        removeFromFavorites={removeFromFavorites}
        refreshPosts={refreshPosts}
        deletePost={deletePost}
        user={props.userProp}
        posts={feedToggle === FeedOptions.Feed ? posts : favorites}
      />
    </div>
  );
}