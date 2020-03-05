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

class LoginTest extends Component<IAuthProps, IAuthState> {
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

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e: React.FormEvent) => {
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

  handleSubmitGuest = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post('/auth/login', {
        email: 'guestuser@gmail.com',
        password: 'password123',
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
      <section>
        <form onSubmit={this.handleSubmit}>
          <h1>login</h1>
          <div className='input-container mb-8'>
            <input
              onChange={this.handleInputChange}
              value={this.state.email}
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
          <div className='input-container mb-8'>
            <input
              onChange={this.handleInputChange}
              value={this.state.password}
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
              <div className='flex center btn btn-two'>login</div>
            </div>
          </button>
        </form>
        <form onSubmit={this.handleSubmitGuest}>
          <button className='none' type='submit' value='login'>
            <div className='container-2 mt-10'>
              <div className='flex center btn btn-two'>guest</div>
            </div>
          </button>
        </form>
        <p>{this.state.message}</p>
      </section>
    );
  }
}

export default LoginTest;
