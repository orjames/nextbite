import React, { useState } from 'react';
import { LiftTokenInterface } from './types/react-app-env';
import axios from 'axios';


interface Props {
  liftTokenToState: (arg0: LiftTokenInterface) => void;
}

enum InputEnum {
  'firstName',
  'lastName',
  'email',
  'password',
  'company',
}

export const Signup = (props: Props) => {
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isCompany, setIsCompany] = useState<boolean>()
  const [company, setCompany] = useState<string>('')

  const handleDropDownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.value) {
      case 'restaurant':
        setIsCompany(true);
        break;
      case 'user':
        setIsCompany(false);
        break;
      default:
        break;
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    switch (e.target.name) {
      case InputEnum[0]:
        setFirstName(e.target.name)
        break;
      case InputEnum[1]:
        setLastName(e.target.name)
        break;
      case InputEnum[2]:
        setEmail(e.target.name)
        break;
      case InputEnum[3]:
        setPassword(e.target.name)
        break;
      case InputEnum[4]:
        setCompany(e.target.name)
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post('/auth/signup', {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        isCompany: isCompany,
        company: company,
        posts: [],
        favorites: []
      })
      .then(res => {
        console.log(res);
        if (res.data.type === 'error') {
          setMessage(res.data.message)
          console.log(`error ${res.data.message}`);
        } else {
          localStorage.setItem('mernToken', res.data.token);
          props.liftTokenToState(res.data);
        }
      })
      .catch(err => {
        console.log(err.response);
        setMessage(err.response.data.message)
      });
  };

  const generateSignupForm = (isCompany: boolean | undefined) => {
    return (
      <>
        <div className='input-container'>
          <input
            onChange={handleInputChange}
            value={firstName}
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
            onChange={handleInputChange}
            value={lastName}
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
            onChange={handleInputChange}
            value={email}
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
            onChange={handleInputChange}
            value={password}
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
  };

  const generateCompanyNameField = () => {
    if (isCompany) {
      return (
        <div className='input-container'>
          <input
            onChange={handleInputChange}
            value={company}
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
      )
    }
  }

  return (
    <section>
      <form className='' onSubmit={handleSubmit}>
        <div className='input-container'>
          <label className='input-label' htmlFor='isCompany'>
            Are you a user or restaurant?
          </label>
          <select
            onChange={handleDropDownChange}
            name='isCompany'
            placeholder='Are you signing up on behalf of a restaurant?'
            className=''
          >
            <option value={'user'}>User</option>
            <option value={'restaurant'}>Restaurant</option>
          </select>
        </div>
        {generateCompanyNameField()}
        {generateSignupForm(isCompany)}
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}

export default Signup;
