import React, { Component } from 'react';
import Signup from './Signup';
import Login from './Login';
import { Home } from './Home';
import UserProfile from './UserProfile';
import CreatePost from './CreatePost';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Noodles from './images/noodles.svg';
import HomeIcon from './images/home-solid';
import ProfileIcon from './images/id-badge-regular';
import CreateIcon from './images/plus-square-regular';
import { UserInterface, LocationInterface } from './types/react-app-env';

interface State {
  token: string;
  user: UserInterface | null;
  errorMessage: string;
  lockedResult: string;
  userLocation: LocationInterface | null;
}

interface Props {
  // user?: UserInterface;
}

class App extends React.Component<Props, State> {
  // if you refresh the browser, you lose the state, so we save token in both state and local storage
  // token determines if the user is logged in, will send that token to the back-end every time we need
  // to query the API, as long as that's there, the express JWT module will allow you to access the routes
  // rate limited will make it so you can't attempt to login unsuccessfully many times before it locks you out
  constructor(props: State) {
    super(props);
    this.state = {
      token: '',
      user: null,
      errorMessage: '',
      lockedResult: '',
      userLocation: {
        lat: 37.7749,
        long: 122.4194,
        accuracy: 100,
      },
    };
    this.liftTokenToState = this.liftTokenToState.bind(this);
    this.checkForLocalToken = this.checkForLocalToken.bind(this);
    this.logout = this.logout.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  checkForLocalToken = () => {
    // look in local storage for the token
    let token = localStorage.getItem('mernToken');
    if (!token || token === 'undefined') {
      // there is no token
      localStorage.removeItem('mernToken');
      this.setState({
        token: '',
        user: null,
      });
    } else {
      // found a token, send it to be verified
      axios.post('/auth/me/from/token', { token }).then((res) => {
        if (res.data.type === 'error') {
          localStorage.removerItem('mernToken');
          this.setState({ errorMessage: res.data.message });
        } else {
          // put token in local storage
          localStorage.setItem('mernToken', res.data.token);
          // put token in state
          this.setState({
            token: res.data.token,
            user: res.data.user,
          });
        }
      });
    }
  };

  getLocation = () => {
    let error = () => {
      let location = {
        lat: 37.7749,
        long: 122.4194,
        accuracy: 100,
      };
      this.setState({
        userLocation: location,
      });
    }
    let success = (position: any) => {
      var crd = position.coords;

      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
      let location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      this.setState({
        userLocation: location,
      });
    }
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error)
    }
  };

  componentDidMount() {
    this.checkForLocalToken();
    this.getLocation();
  }

  liftTokenToState = (data: any) => {
    this.setState({
      token: data.token,
      user: data.user,
    });
  };

  logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('mernToken');
    // Remove the user and token from state
    this.setState({
      token: '',
      user: null,
    });
  };

  handleClick(e: any) {
    e.preventDefault();
    // axios.defaults.headers.common['Authorization'] = `Bearer ${
    //   this.state.token
    // }`; // this applies globally to all axios calls, sends token, otherwise do the config below for specific axios call
    let config = {
      headers: {
        Authorization: `Bearer ${this.state.token}`,
      },
    };
    axios.get('/locked/test', config).then((res) => {
      this.setState({
        lockedResult: res.data,
      });
    });
  }

  generateNavigation = (user: UserInterface) => {
    if (user.isCompany === 'restaurant') {
      return (
        <div className='top-nav'>
          <Link to='/'>
            <HomeIcon className='fav-button home-icon home-icon'/>
          </Link>
          <Link to={`/profile/${user._id}`}>
            <ProfileIcon className='fav-button home-icon'/>
          </Link>
          <Link to={`/create-post`}>
            <CreateIcon className='fav-button home-icon'/>
          </Link>
        </div>
      );
    } else {
      return (
        <div className='top-nav'>
          <Link to='/'>
            <HomeIcon className='fav-button home-icon'/>
          </Link>
          <Link to={`/profile/${user._id}`}>
            <ProfileIcon className='fav-button home-icon'/>
          </Link>
        </div>
      );
    }
  }

  generateRouterOrLogin = (user: UserInterface | null) => {
    if (user) {
      return (
        <div className="app-div">
          <Router>
            {this.generateNavigation(user)}
            <Route
              path='/'
              exact
              render={() => (
                <Home
                  user={this.state.user as UserInterface}
                  logout={this.logout}
                  userLocation={this.state.userLocation as LocationInterface}
                  checkForLocalToken={this.checkForLocalToken}
                  {...this.props}
                />
              )}
            />
            <Route
              path={`/profile/${user._id}`}
              exact
              render={() => (
                <UserProfile user={this.state.user} logout={this.logout} />
              )}
            />
            <Route
              path={`/create-post`}
              exact
              render={() => (
                <CreatePost
                  user={this.state.user}
                  userLocation={this.state.userLocation}
                  {...this.props}
                />
              )}
            />
          </Router>
        </div>
      );
    } else {
      return (
        <div className='app-div'>
          <Signup liftTokenToState={this.liftTokenToState} />
          <Login liftTokenToState={this.liftTokenToState} />
        </div>
      );
    }
  }

  render() {
 
    
    return (
      <div className='App'>
        <div className='app-header'>
          <h1 className="app-title">
            nextbite
          </h1>
          <img
            src={Noodles}
            alt='noodles'
            className="app-logo"
          />
        </div>
        {this.generateRouterOrLogin(this.state.user)}
      </div>
    );
  }
}

export default App;
