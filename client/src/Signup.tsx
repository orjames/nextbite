import React, { Component } from 'react';
import axios from 'axios';

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

interface Props {
  liftTokenToState: (arg0: LiftTokenInterface) => void;
}

interface State {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  message?: string;
  isCompany?: string | undefined;
  company?: string;
}

class Signup extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      message: '',
      isCompany: '',
      company: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  // prettier-ignore
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post('/auth/signup', {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        isCompany: this.state.isCompany,
        company: this.state.company,
        posts: [],
        favorites: []
      })
      .then(res => {
        console.log(res);
        if (res.data.type === 'error') {
          this.setState({
            message: res.data.message
          });
          console.log(`error ${res.data.message}`);
        } else {
          localStorage.setItem('mernToken', res.data.token);
          this.props.liftTokenToState(res.data);
        }
      })
      .catch(err => {
        console.log(err.response);
        this.setState({
          message: err.response.data.message
        });
      });
  };

  generateSignupForm = (isCompany: string | undefined) => {
    if (isCompany) {
      return (
        <>
          <div className='input-container'>
            <input
              onChange={this.handleInputChange}
              value={this.state.firstName}
              name='firstName'
              id='firstName'
              className='input'
              type='text'
              pattern='.+'
              required
            />
            <label className='label' htmlFor='firstName'>
              first name
            </label>
          </div>
          <div className='input-container'>
            <input
              onChange={this.handleInputChange}
              value={this.state.lastName}
              name='lastName'
              id='lastName'
              className='input'
              type='text'
              pattern='.+'
              required
            />
            <label className='label' htmlFor='lastName'>
              last name
            </label>
          </div>
          <div className='input-container'>
            <input
              onChange={this.handleInputChange}
              value={this.state.email}
              name='email'
              id='email'
              className='input'
              type='text'
              pattern='.+'
              required
            />
            <label className='label' htmlFor='email'>
              email
            </label>
          </div>
          <div className='input-container'>
            <input
              onChange={this.handleInputChange}
              value={this.state.password}
              name='password'
              id='password'
              className='input'
              type='password'
              pattern='.+'
              required
            />
            <label className='label' htmlFor='password'>
              choose password
            </label>
          </div>
          <button className='none' type='submit' value='signup'>
            <div className='container-2'>
              <div className='btn btn-two'>signup</div>
            </div>
          </button>
        </>
      );
    } else {
      return null;
    }
  };

  render() {
    let field;
    if (this.state.isCompany === 'restaurant') {
      field = (
        <div className='input-container'>
          <input
            onChange={this.handleInputChange}
            value={this.state.company}
            name='company'
            id='company'
            className='input'
            type='text'
            pattern='.+'
          />
          <label className='label' htmlFor='company'>
            restaurant name
          </label>
        </div>
      );
    }

    return (
      <section>
        <h1>create a new account</h1>
        <form className='' onSubmit={this.handleSubmit}>
          <div className='input-container'>
            <label className='input-label' htmlFor='isCompany'>
              Are you a user or restaurant?
            </label>
            <select
              onChange={this.handleInputChange}
              value={this.state.isCompany}
              name='isCompany'
              placeholder='Are you signing up on behalf of a restaurant?'
              className=''
            >
              <option value='' disabled>
                select...
              </option>
              <option value='user'>User</option>
              <option value='restaurant'>Restaurant</option>
            </select>
          </div>
          {field}
          {this.generateSignupForm(this.state.isCompany)}
        </form>
        {this.state.message ? <p>{this.state.message}</p> : null}
      </section>
    );
  }
}

export default Signup;
