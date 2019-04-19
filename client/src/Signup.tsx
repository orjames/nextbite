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
}

interface IAuthState {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  message?: string;
  isCompany?: string;
  company?: string;
}

class Signup extends Component<IAuthProps, IAuthState> {
  constructor(props: IAuthProps) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      message: '',
      isCompany: '',
      company: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post('/auth/signup', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        isCompany: this.state.isCompany,
        company: this.state.company ? this.state.company : 'none',
        posts: [],
        favorites: [],
      })
      .then((res) => {
        console.log(res);
        if (res.data.type === 'error') {
          this.setState({
            message: res.data.message,
          });
          console.log(`error ${res.data.message}`);
        } else {
          localStorage.setItem('mernToken', res.data.token);
          this.props.liftTokenToState(res.data);
        }
      })
      .catch((err) => {
        console.log(err.response);
        this.setState({
          message: err.response.data.message,
        });
      });
  };

  render() {
    let field;
    if (this.state.isCompany === 'restaurant') {
      field = (
        <input
          onChange={this.handleInputChange}
          value={this.state.company}
          type='text'
          name='company'
          placeholder='enter restaurant name...'
          className='mb-1 auth-input'
        />
      );
    }

    return (
      <div className='flex column align-center'>
        <h3>create a new account:</h3>
        <form className='flex column align-center' onSubmit={this.handleSubmit}>
          <select
            onChange={this.handleInputChange}
            value={this.state.isCompany}
            name='isCompany'
            placeholder='Are you signing up on behalf of a restaurant?'
            className='mb-1 auth-input'
          >
            <option value='' disabled>
              select...
            </option>
            <option value='user'>User</option>
            <option value='restaurant'>Restaurant</option>
          </select>
          <label className='' htmlFor='isCompany'>
            are you signing up on behalf of a restaurant?
          </label>
          <input
            onChange={this.handleInputChange}
            value={this.state.firstName}
            type='text'
            name='firstName'
            placeholder='your first name...'
            className='mb-1 auth-input'
          />
          <input
            onChange={this.handleInputChange}
            value={this.state.lastName}
            type='text'
            name='lastName'
            placeholder='your last name...'
            className='mb-1 auth-input'
          />
          <input
            onChange={this.handleInputChange}
            value={this.state.email}
            type='email'
            name='email'
            placeholder='your email...'
            className='mb-1 auth-input'
          />
          <input
            onChange={this.handleInputChange}
            value={this.state.password}
            type='password'
            name='password'
            placeholder='choose a password...'
            className='mb-1 auth-input'
          />
          {field}
          <input className='auth-button' type='submit' value='signup' />
        </form>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default Signup;
