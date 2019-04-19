import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

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
interface IProfileProps {
  user: IUser | null;
  logout: () => void;
}

const UserProfile = (props: IProfileProps) => {
  if (props.user !== null && props.user !== undefined) {
    return (
      <div className='UserProfile'>
        <p>hello I am {props.user.firstName}</p>
        <Router>
          <Link to='/' onClick={props.logout}>
            Logout
          </Link>
        </Router>
      </div>
    );
  } else {
    return <div className='UserProfile'>no user</div>;
  }
};

export default UserProfile;
