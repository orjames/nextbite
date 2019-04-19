import React, { Component } from 'react';
import './App.css';
import SignupTest from './SignupTest';
import LoginTest from './LoginTest';
import Home from './Home';
import UserProfile from './UserProfile';
import CreatePost from './CreatePost';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Noodles from './images/noodles.svg';
import HomeIcon from './images/home-solid';
import ProfileIcon from './images/id-badge-regular';
import CreateIcon from './images/plus-square-regular';

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

interface ILocation {
  lat: number;
  long: number;
  accuracy: number;
}

interface IAppState {
  token: string;
  user: IUser | null;
  errorMessage: string;
  lockedResult: string;
  userLocation: ILocation | null;
}

interface IAppProps {
  // user?: IUser;
}

class App extends React.Component<IAppProps, IAppState> {
  // if you refresh the browser, you lose the state, so we save token in both state and local storage
  // token determines if the user is logged in, will send that token to the back-end every time we need
  // to query the API, as long as that's there, the express JWT module will allow you to access the routes
  // rate limited will make it so you can't attempt to login unsuccessfully many times before it locks you out
  constructor(props: IAppState) {
    super(props);
    this.state = {
      token: '',
      user: null,
      errorMessage: '',
      lockedResult: '',
      userLocation: null,
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

  componentDidMount() {
    this.checkForLocalToken();
    this.getLocation();
  }

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let location = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        this.setState({
          userLocation: location,
        });
      });
    } else {
      let location = {
        lat: 37.7749,
        long: 122.4194,
        accuracy: 100,
      };
      this.setState({
        userLocation: location,
      });
    }
  };

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

  render() {
    let user = this.state.user;
    let contents;
    if (user) {
      let navigation;
      if (user.isCompany === 'restaurant') {
        navigation = (
          <div className='nav flex row space-evenly'>
            <Link to='/'>
              <HomeIcon className='fav-button' width={'2.3rem'} />
            </Link>
            <Link to={`/profile/${user._id}`}>
              <ProfileIcon className='fav-button' width={'2.3rem'} />
            </Link>
            <Link to={`/create-post`}>
              <CreateIcon className='fav-button' width={'2.3rem'} />
            </Link>
          </div>
        );
      } else {
        navigation = (
          <div className='nav flex row space-evenly'>
            <Link to='/'>
              <HomeIcon className='fav-button' width={'2.3rem'} />
            </Link>
            <Link to={`/profile/${user._id}`}>
              <ProfileIcon className='fav-button' width={'2.3rem'} />
            </Link>
          </div>
        );
      }
      contents = (
        <>
          <header>
            <div className='header mt-10'>
              nextbite{' '}
              <img
                src={Noodles}
                alt='noodles'
                width={'55px'}
                color={'rgb(228, 222, 222)'}
              />
            </div>
            <Router>
              {navigation}
              <Route
                path='/'
                exact
                render={() => (
                  <Home
                    user={user as IUser}
                    logout={this.logout}
                    userLocation={this.state.userLocation as ILocation}
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
          </header>
        </>
      );
    } else {
      contents = (
        <div className='flex column align-center'>
          <div className='header mt-10'>
            nextbite{' '}
            <img
              src={Noodles}
              alt='noodles'
              width={'55px'}
              color={'rgb(228, 222, 222)'}
            />
          </div>
          <div className='border pd-2'>
            {/* <Signup liftTokenToState={this.liftTokenToState} /> */}
            {/* <Login liftTokenToState={this.liftTokenToState} /> */}
            <LoginTest liftTokenToState={this.liftTokenToState} />
            <SignupTest liftTokenToState={this.liftTokenToState} />
          </div>
        </div>
      );
    }
    return (
      <div className='App'>
        <div className='flex'>{contents}</div>
      </div>
    );
  }
}

export default App;
