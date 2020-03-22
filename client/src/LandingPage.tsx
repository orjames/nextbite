import React, { useState } from 'react';
import classNames from 'classnames';
import axios from 'axios';
import { LiftTokenInterface } from './types/react-app-env';
import { Login } from './Login';
import { Signup } from './Signup';

interface Props {
  liftTokenToState: (arg0: LiftTokenInterface) => void;
}

enum LoginOrSignupEnum {
  'signup',
  'login',
}

export const LandingPage = (props: Props) => {
  const [loginOrSignup, setLoginOrSignup] = useState<LoginOrSignupEnum | null>(LoginOrSignupEnum.login)
  const [message, setMessage] = useState<string>('')

  const handleGuestSubmit = (e: React.FormEvent, passedEmail: string, passedPassword: string) => {
    e.preventDefault();
    axios
      .post('/auth/login', {
        email: passedEmail,
        password: passedPassword,
      })
      .then(res => {
        if (res.data.type === 'error') {
          setMessage(res.data.message)
        } else {
          localStorage.setItem('mernToken', res.data.token);
          props.liftTokenToState(res.data);
        }
      })
      .catch(err => {
        setMessage(err.response.data.message)
      });
  };

  return (
    <div>
      <div className="login-or-signup-div">
        <div className="toggle-container">
          <button className={classNames("toggle-button", { selected: loginOrSignup === LoginOrSignupEnum.login })} onClick={() => setLoginOrSignup(LoginOrSignupEnum.login)}>
            login
        </button>
          <button className={classNames("toggle-button", { selected: loginOrSignup === LoginOrSignupEnum.signup })} onClick={() => setLoginOrSignup(LoginOrSignupEnum.signup)}>
            signup
        </button>
        </div>
        {loginOrSignup === LoginOrSignupEnum.signup ?
          <Signup liftTokenToState={props.liftTokenToState} /> :
          <Login liftTokenToState={props.liftTokenToState} />}
      </div>
      <section>
        <form onSubmit={e => handleGuestSubmit(e, 'guestuser@gmail.com', 'password123')}>
          <button className='none' type='submit' value='login'>
            <div className='container-2'>
              <div className='btn btn-two'>guest</div>
            </div>
          </button>
        </form>
      </section>
    </div>
  )
}