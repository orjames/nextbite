# nextbite

## Mongo-Express-React-Node.js Project. Done using TypeScript

### Overview

[First, deployed live link](https://nextbite.herokuapp.com/)

Have you ever been in a situation where you and your friend/spouse/partner/whatever want to go out for dinner but can't think of what to get? Of course you have. Nextbite ends your indecisiveness and hunger by providing you with a 'feed' of photos of food. These photos can only be posted by local companies, and usually offer deals. User's scroll until they find something that catches their eye. Think instagram for food.

##### First, Screenshots of the (still unfinished) product:

|                                                                                                                          |                                                                                                              |
| :----------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/orjames/nextbite/blob/master/client/src/images/screenshot1.JPG" height="400" width='300' /> | <img src="https://github.com/orjames/nextbite/blob/master/client/src/images/screenshot2.JPG" height="400" /> |
|       <img src="https://github.com/orjames/nextbite/blob/master/client/src/images/screenshot3.JPG" height="400" />       | <img src="https://github.com/orjames/nextbite/blob/master/client/src/images/screenshot4.JPG" height="400" /> |

---

### WireFrames/ERD

I started with a basic concept of how the data structures would look and how they are related, then made a few revisions as I sorted through what additional data would be needed and what was unnecesary.

This was my first draft:

<img src="https://github.com/orjames/nextbite/blob/master/client/src/images/erd-draft.JPG" height="400" />

Now cleaned up a bit:

<img src="https://github.com/orjames/nextbite/blob/master/client/src/images/erd-final.JPG" height="400" />

---

### Technical Goals

Goals for my app include (but definitely are not limited to):

- **Use Express** to build an application backend
- **Create an application using at least 2 related models**, one of which should be a user
- Include **all major CRUD functions** distributed as appropriate amongst those models.
- Create own front-end
- **Add authentication/authorization** to restrict access to appropriate users
- Layout and style front-end with **clean & well-formatted CSS**, with or without a framework.
- **Deploy application online** so it's publicly accessible.

---

### TypeScript

Making sure I used typescript was imperative for this app

### React Hooks

I decided to refactor the app using React Hooks (it's the future!)

Old Code (gross I know)
```javascript
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
```

New, cleaner, easier to navigate, using funcitonal components, React Hooks, code:
```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Feed from './Feed';
import classNames from 'classnames';
import { PostInterface, LocationInterface, UserInterface, FeedOptions } from './types/react-app-env'

interface Props {
  user: UserInterface;
  userLocation: LocationInterface;
  logout: () => void;
  checkForLocalToken: () => void;
}

export const Home = (props: Props) => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  let [feedToggle, setFeedToggle] = useState<FeedOptions>(FeedOptions.Feed);
  const [favorites, setFavorites] = useState<PostInterface[]>([]);
  
  useEffect(() => {
    // getting all posts
    axios
    .get('/api/posts')
    .then((res: any) => {
      setPosts(res.data)
    })
    .then(() => {
      axios.get(`/api/users/${props.user._id}`).then((res: any) => {
        setFavorites(res.data.favorites)
      });
    });
  })

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
    let userId = props.user._id;
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
    favorites.push(post);
    axios
      .put(`/api/users/${props.user._id}/favorite`, { favorites })
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
      .put(`/api/users/${props.user._id}/favorite`, { filteredFavorites })
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
          className={classNames('feed-toggle-button', {
            selected: feedToggle === FeedOptions.Feed
          })}
          onClick={() => changeFeed(FeedOptions.Feed)}
        >
          feed
        </button>
        <button
          className={classNames('feed-toggle-button', {
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
      <div className='app-div'>
        {generateToggle(feedToggle)}
        <Feed
          feedToggle={feedToggle}
          location={props.userLocation}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          refreshPosts={refreshPosts}
          deletePost={deletePost}
          user={props.user}
          posts={feedToggle === FeedOptions.Feed ? posts : favorites}
        />
      </div>
    );
}

```

### Routes and Backend

The bulk of my project was done on the backend leveraging three main models. User, Post, and Comment. Some of the highlights of my Routes were adding comments, having to reload all the posts then triggering a re-render function on the front-end to display the comment (which existed on the backend) to the front end. Here's how I managed that:
Backend:

```javascript
// POST /posts/:pid/comments - CREATES a new comment for that post
router.post('/posts/:pid/comments', (req, res) => {
  console.log('\x1b[36m%s\x1b[0m', 'In POST /posts/:pid/comments');
  Post.findById(req.params.pid, (err, post) => {
    let newComment = new Comment({
      body: req.body.body,
      user: req.body.user
    });
    newComment.save((err, comment) => {
      post.comments.push(comment);
      post.save((err, post) => {
        Post.find({})
          .populate('comments')
          .exec((err, posts) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              res.status(200).json(posts);
            }
          });
      });
    });
  });
});
```

FrontEnd: (key here is this.props.refreshPosts(res.data))

```javascript
handleSubmit = (e: any, postId: string) => {
  e.preventDefault();
  axios
    .post(`/api/posts/${postId}/comments`, {
      body: this.state.body,
      user: this.props.user.firstName + ' ' + this.props.user.lastName
    })
    .then(res => {
      if (res.data.type === 'error') {
        this.setState({
          message: res.data.message
        });
        console.log(`error ${res.data.message}`);
      } else {
        this.props.refreshPosts(res.data);
      }
    })
    .then(() => {
      this.changeCommenting();
    })
    .catch(err => {
      console.log(err);
      this.setState({
        message: err
      });
    });
};
```

---

### Getting started

cd into nextbite and run yarn start
cd into nextbite/client and run nodemon

connecting to heroku:
install heroku CLI

add a remote to your local repository:
  heroku git:remote -a nextbite

getting the URI for the mongodb:
  heroku config:get MONGODB_URI
    put that as the MONGODB_URI in your .env file

Deploying code:
  git push heroku master

