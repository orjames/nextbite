import React, { useState } from 'react';
import { LiftTokenInterface } from './types/react-app-env';
import { Login } from './Login';
import Signup from './Signup';

interface Props {
  liftTokenToState: (arg0: LiftTokenInterface) => void;
}

enum LoginOrSignupEnum {
  'signup',
  'login',
}

export const LandingPage = (props: Props) => {
  const [loginOrSignup, setLoginOrSignup] = useState<LoginOrSignupEnum | null>(null)

  return (
    <div className="login-or-signup-div">
      <div className="login-signup-toggle">
        <div className="login-toggle" onClick={() => setLoginOrSignup(LoginOrSignupEnum.login)}>
          login
        </div>
        <div className="signup-toggle" onClick={() => setLoginOrSignup(LoginOrSignupEnum.signup)}>
          signup
        </div>
      </div>
      {loginOrSignup === LoginOrSignupEnum.signup ? <Signup liftTokenToState={props.liftTokenToState} /> : <Login liftTokenToState={props.liftTokenToState} />}
    </div>
  )
}