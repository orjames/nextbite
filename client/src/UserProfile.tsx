import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  message: string;
  isCompany: string;
  company: string;
  posts: object[];
}
interface IProfileProps {
  user: UserInterface | null;
  logout: () => void;
}

const UserProfile = (props: IProfileProps) => {
  if (props.user !== null && props.user !== undefined) {
    let greeting;
    if (props.user.company !== '') {
      greeting = (
        <div>
          <div>
            <span className='bold'>name: </span>
            {props.user.firstName} {props.user.lastName}
          </div>
          <div>
            <span className='bold'>company: </span> {props.user.company}
          </div>
        </div>
      );
    } else {
      greeting = (
        <div>
          <span className='bold'>name: </span>
          {props.user.firstName} {props.user.lastName}
        </div>
      );
    }
    return (
      <div className='flex column'>
        <div>{greeting}</div>
        <div>
          <span className='bold'>posts: </span> {props.user.posts.length}
        </div>
        <div className='flex center'>
          <Router>
            <Link to='/' onClick={props.logout}>
              Logout
            </Link>
          </Router>
        </div>
      </div>
    );
  } else {
    return <div className='UserProfile'>no user</div>;
  }
};

export default UserProfile;
