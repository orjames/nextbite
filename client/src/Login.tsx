import React, { Component } from 'react';
import axios from 'axios';

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

interface IAuthProps {
  liftTokenToState: (arg0: ILiftToken) => void;
  // saying this is a function with argument arg0 of type ILiftToken, void function (returns nothing)
}

interface IAuthState {
  email?: string;
  password?: string;
  message?: string;
}

class Login extends Component<IAuthProps, IAuthState> {
  constructor(props: IAuthProps) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post('/auth/login', {
        email: this.state.email,
        password: this.state.password,
      })
      .then((res) => {
        if (res.data.type === 'error') {
          this.setState({
            message: res.data.message,
          });
        } else {
          localStorage.setItem('mernToken', res.data.token);
          this.props.liftTokenToState(res.data);
        }
      })
      .catch((err) => {
        this.setState({
          message: err.response.data.message,
        });
      });
  };

  render() {
    return (
      <div className='flex column align-center'>
        <h3>log in to your account:</h3>
        <form className='flex column align-center' onSubmit={this.handleSubmit}>
          <input
            onChange={this.handleInputChange}
            value={this.state.email}
            type='email'
            name='email'
            placeholder='enter your email...'
            className='mb-1 auth-input'
          />
          <input
            onChange={this.handleInputChange}
            value={this.state.password}
            type='password'
            name='password'
            placeholder='enter your password...'
            className='mb-1 auth-input'
          />
          <input className='auth-button' type='submit' value='login' />
        </form>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Login;
