import React, { Component } from 'react';
import axios from 'axios';
import Feed from './Feed';

export interface ILocation {
  lat: number;
  long: number;
  accuracy: number;
}

interface IPost {
  caption: string;
  company: string;
  createdAt: string;
  location: ILocation;
  publicId: string;
  tags: string[];
  updatedAt: Date;
  _id: string;
}

interface IHomeState {
  posts: Array<IPost>;
  favoritesSelected: boolean;
  favorites: Array<IPost>;
}

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  message: string;
  isCompany: string;
  company: string;
}

interface ILiftToken {
  token: string;
  user: IUser;
  message: string;
}

interface IHomeProps {
  user: IUser;
  userLocation: ILocation;
  logout: () => void;
  checkForLocalToken: () => void;
}

class Home extends React.Component<IHomeProps, IHomeState> {
  constructor(props: any) {
    super(props);
    this.state = {
      posts: [],
      favoritesSelected: false,
      favorites: [],
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
          posts: res.data,
        });
      })
      .then(() => {
        axios.get(`/api/users/${this.props.user._id}`).then((res: any) => {
          this.setState({
            favorites: res.data.favorites,
          });
        });
      });
  }

  // change feed to view favorites or feed
  changeFeed = () => {
    this.setState((prevState: IHomeState) => ({
      favoritesSelected: !prevState.favoritesSelected,
    }));
  };

  refreshPosts = (postData: Array<IPost>) => {
    this.setState({
      posts: postData,
    });
  };

  deletePost = (e: any, pid: string) => {
    console.log('\x1b[32m', 'in deletePost', pid);
    e.preventDefault();
    let userId = this.props.user._id;
    axios
      .delete(`/api//users/${userId}/posts/${pid}`, {})
      .then((res) => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          this.refreshPosts(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // add to favorites
  addToFavorites = (post: IPost) => {
    let favorites: any;
    if (this.state.favorites === null) {
      favorites = [];
    } else {
      favorites = Array.from(this.state.favorites);
    }
    favorites.push(post);
    axios
      .put(`/api/users/${this.props.user._id}/favorite`, { favorites })
      .then((res) => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          console.log('\x1b[32m', 'res.data:');
          console.log(res.data);
          this.setState({
            favorites: res.data.favorites,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        this.props.checkForLocalToken();
      });
  };

  // remove from favorites
  removeFromFavorites = (inputPost: IPost) => {
    let favorites: IPost[];
    if (this.state.favorites === null) {
      favorites = [];
    } else {
      favorites = Array.from(this.state.favorites);
    }
    let filteredFavorites = [];
    filteredFavorites = favorites.filter((post: IPost) => {
      return post.publicId !== inputPost.publicId;
    });
    axios
      .put(`/api/users/${this.props.user._id}/favorite`, { filteredFavorites })
      .then((res) => {
        if (res.data.type === 'error') {
          console.log(`error ${res.data.message}`);
        } else {
          this.setState({
            favorites: res.data.favorites,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        this.props.checkForLocalToken();
      });
  };

  render() {
    let display;
    // if the user has selected to view their favorites
    let feedOrFavorites;
    if (this.state.favoritesSelected) {
      feedOrFavorites = this.state.favorites;
    } else {
      feedOrFavorites = this.state.posts;
    }

    display = (
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
    );

    let toggle;
    if (this.state.favoritesSelected) {
      toggle = (
        <button className='fav-button toggle fancy' onClick={this.changeFeed}>
          back to feed
        </button>
      );
    } else {
      toggle = (
        <button className='fav-button toggle fancy' onClick={this.changeFeed}>
          view favorites
        </button>
      );
    }

    return (
      <div className='flex column'>
        <div className='flex center border mb-4 mt-4'>{toggle}</div>
        {display}
      </div>
    );
  }
}

export default Home;
