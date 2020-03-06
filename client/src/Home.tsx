import React, { Component } from 'react';
import axios from 'axios';
import Feed from './Feed';
import classNames from 'classnames';

export interface LocationInterface {
  lat: number;
  long: number;
  accuracy: number;
}

interface PostInterface {
  caption: string;
  company: string;
  createdAt: string;
  location: LocationInterface;
  publicId: string;
  tags: string[];
  updatedAt: Date;
  _id: string;
}

interface IHomeState {
  posts: Array<PostInterface>;
  favoritesSelected: boolean;
  favorites: Array<PostInterface>;
}

interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  message: string;
  isCompany: string;
  company: string;
}

interface LiftTokenInterface {
  token: string;
  user: UserInterface;
  message: string;
}

interface IHomeProps {
  user: UserInterface;
  userLocation: LocationInterface;
  logout: () => void;
  checkForLocalToken: () => void;
}

class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
      favoritesSelected: false,
      favorites: []
    };
    this.addToFavorites = this.addToFavorites.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    this.changeFeed = this.changeFeed.bind(this);
  }

  componentDidMount() {
    // getting all posts
    axios
      .get('/api/posts')
      .then((res: any) => {
        this.setState({
          posts: res.data
        });
      })
      .then(() => {
        axios.get(`/api/users/${this.props.user._id}`).then((res: any) => {
          this.setState({
            favorites: res.data.favorites
          });
        });
      });
  }

  // change feed to view favorites or feed
  changeFeed = () => {
    this.setState((prevState: IHomeState) => ({
      favoritesSelected: !prevState.favoritesSelected
    }));
  };

  refreshPosts = (postData: Array<PostInterface>) => {
    this.setState({
      posts: postData
    });
  };

  deletePost = (e: any, pid: string) => {
    console.log('\x1b[32m', 'in deletePost', pid);
    e.preventDefault();
    let userId = this.props.user._id;
    axios
      .delete(`/api//users/${userId}/posts/${pid}`, {})
      .then(res => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          this.refreshPosts(res.data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  // add to favorites
  addToFavorites = (post: PostInterface) => {
    let favorites: any;
    if (this.state.favorites === null) {
      favorites = [];
    } else {
      favorites = Array.from(this.state.favorites);
    }
    favorites.push(post);
    axios
      .put(`/api/users/${this.props.user._id}/favorite`, { favorites })
      .then(res => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          console.log('\x1b[32m', 'res.data:');
          console.log(res.data);
          this.setState({
            favorites: res.data.favorites
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        this.props.checkForLocalToken();
      });
  };

  // remove from favorites
  removeFromFavorites = (inputPost: PostInterface) => {
    let favorites: PostInterface[];
    if (this.state.favorites === null) {
      favorites = [];
    } else {
      favorites = Array.from(this.state.favorites);
    }
    let filteredFavorites = [];
    filteredFavorites = favorites.filter((post: PostInterface) => {
      return post.publicId !== inputPost.publicId;
    });
    axios
      .put(`/api/users/${this.props.user._id}/favorite`, { filteredFavorites })
      .then(res => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          this.setState({
            favorites: res.data.favorites
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        this.props.checkForLocalToken();
      });
  };

  generateToggle = (favoritesSelected: boolean) => {
    return (
      <div className='toggle-container'>
        <button
          className={classNames('feed-toggle-button', {
            selected: !this.state.favoritesSelected
          })}
          onClick={this.changeFeed}
        >
          back to feed
        </button>
        <button
          className={classNames('feed-toggle-button', {
            selected: this.state.favoritesSelected
          })}
          onClick={this.changeFeed}
        >
          view favorites
        </button>
      </div>
    );
  };

  render() {
    // if the user has selected to view their favorites
    let feedOrFavorites;
    if (this.state.favoritesSelected) {
      feedOrFavorites = this.state.favorites;
    } else {
      feedOrFavorites = this.state.posts;
    }

    return (
      <div className='app-div'>
        {this.generateToggle(this.state.favoritesSelected)}
        <Feed
          favoritesSelected={this.state.favoritesSelected}
          location={this.props.userLocation}
          addToFavorites={this.addToFavorites}
          removeFromFavorites={this.removeFromFavorites}
          refreshPosts={this.refreshPosts}
          deletePost={this.deletePost}
          posts={feedOrFavorites}
          user={this.props.user}
        />
      </div>
    );
  }
}

export default Home;
