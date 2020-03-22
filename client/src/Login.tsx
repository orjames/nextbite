import React, { useState } from 'react';
import axios from 'axios';
import { UserInterface, LiftTokenInterface } from './types/react-app-env';

interface Props {
  liftTokenToState: (arg0: LiftTokenInterface) => void;
}

interface State {
  email?: string;
  password?: string;
  message?: string;
}

export const Login = (props: Props) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.name === 'email' ? setEmail(e.target.value) : setPassword(e.target.value)
  };

  const handleSubmit = (e: React.FormEvent, passedEmail?: string, passedPassword?: string) => {
    e.preventDefault();
    axios
      .post('/auth/login', {
        email: passedEmail ? passedEmail : email,
        password: passedPassword ? passedPassword : password,
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
    <section>
      <form onSubmit={handleSubmit}>
        <div className='input-container'>
          <input
            onChange={handleInputChange}
            value={email}
            name='email'
            id='LoginEmail'
            className='input'
            type='email'
            pattern='.+'
            required
          />
          <label className='label' htmlFor='LoginEmail'>
            email
          </label>
        </div>
        <div className='input-container'>
          <input
            onChange={handleInputChange}
            value={password}
            name='password'
            id='LoginPassword'
            className='input'
            type='password'
            pattern='.+'
            required
          />
          <label className='label' htmlFor='LoginPassword'>
            password
          </label>
        </div>
        <button className='none' type='submit' value='login'>
          <div className='container-2'>
            <div className='btn btn-two'>login</div>
          </div>
        </button>
      </form>
      <div>{message}</div>
    </section>
  );
}
