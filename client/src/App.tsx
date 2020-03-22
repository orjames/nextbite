import React, { useState, useEffect } from 'react';
import { Home } from './Home';
import { LandingPage } from './LandingPage';
import UserProfile from './UserProfile';
import CreatePost from './CreatePost';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Noodles from './images/noodles.svg';
import HomeIcon from './images/home-solid';
import ProfileIcon from './images/id-badge-regular';
import CreateIcon from './images/plus-square-regular';
import { UserInterface, LocationInterface } from './types/react-app-env';

const App = () => {
  // if you refresh the browser, you lose the state, so we save token in both state and local storage
  // token determines if the user is logged in, will send that token to the back-end every time we need
  // to query the API, as long as that's there, the express JWT module will allow you to access the routes
  // rate limited will make it so you can't attempt to login unsuccessfully many times before it locks you out
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<UserInterface | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [lockedResult, setLockedResult] = useState<string>('')
  const [userLocation, setUserLocation] = useState<LocationInterface | null>()


  useEffect(() => {
    checkForLocalToken();
    getLocation();

    return () => {
    };
  }, []);

  const checkForLocalToken = () => {
    // look in local storage for the token
    let token = localStorage.getItem('mernToken');
    if (!token || token === 'undefined') {
      // there is no token
      localStorage.removeItem('mernToken');
      setToken('')
      setUser(null)
    } else {
      // found a token, send it to be verified
      axios.post('/auth/me/from/token', { token }).then((res) => {
        if (res.data.type === 'error') {
          localStorage.removerItem('mernToken');
          setErrorMessage(res.data.message)
        } else {
          // put token in local storage
          localStorage.setItem('mernToken', res.data.token);
          // put token in state
          setToken(res.data.token)
          setUser(res.data.user)
        }
      });
    }
  };

  const getLocation = () => {
    const error = () => {
      let errorlocation = {
        lat: 37.7749,
        long: 122.4194,
        accuracy: 100,
      };
      setUserLocation(errorlocation)
    }
    const success = (position: any) => {
      let location = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      setUserLocation(location)
    }
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error)
    } else {
      error();
    }
  };

  const liftTokenToState = (data: any) => {
    setToken(data.token)
    setUser(data.user)
  };

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('mernToken');
    // Remove the user and token from state
    setToken('')
    setUser(null)
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // axios.defaults.headers.common['Authorization'] = `Bearer ${
    //   state.token
    // }`; // this applies globally to all axios calls, sends token, otherwise do the config below for specific axios call
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios.get('/locked/test', config).then((res) => {
      setLockedResult(res.data)
    });
  }

  const generateNavigation = (user: UserInterface) => {
    if (user.isCompany === 'restaurant') {
      return (
        <div className='top-nav'>
          <Link to='/'>
            <HomeIcon className='fav-button home-icon home-icon' />
          </Link>
          <Link to={`/profile/${user._id}`}>
            <ProfileIcon className='fav-button home-icon' />
          </Link>
          <Link to={`/create-post`}>
            <CreateIcon className='fav-button home-icon' />
          </Link>
        </div>
      );
    } else {
      return (
        <div className='top-nav'>
          <Link to='/'>
            <HomeIcon className='fav-button home-icon' />
          </Link>
          <Link to={`/profile/${user._id}`}>
            <ProfileIcon className='fav-button home-icon' />
          </Link>
        </div>
      );
    }
  }

  const generateRouterOrLogin = (user: UserInterface | null) => {
    if (user) {
      return (
        <div className="app-inner-div">
          <Router>
            {generateNavigation(user)}
            <Route
              path='/'
              exact
              render={() => (
                <Home
                  userProp={user}
                  logout={logout}
                  userLocation={userLocation as LocationInterface}
                  checkForLocalToken={checkForLocalToken}
                />
              )}
            />
            <Route
              path={`/profile/${user._id}`}
              exact
              render={() => (
                <UserProfile user={user} logout={logout} />
              )}
            />
            <Route
              path={`/create-post`}
              exact
              render={() => (
                <CreatePost
                  user={user}
                  userLocation={userLocation}
                />
              )}
            />
          </Router>
        </div>
      );
    } else {
      return (
        <div className='app-inner-div'>
          <LandingPage liftTokenToState={liftTokenToState} />
        </div>
      );
    }
  }



  return (
    <div className='app-div'>
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
      {generateRouterOrLogin(user)}
    </div>
  );
}

export default App;
