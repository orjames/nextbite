import React, { Component } from 'react';
import axios from 'axios';
import CommentIcon from './images/comment-regular';
import CloseIcon from './images/window-close-regular';
import { UserInterface, PostInterface } from './types/react-app-env';

interface Props {
  user: UserInterface;
  commenting: boolean;
  changeCommenting: () => null;
  refreshPosts: (res?: any) => null;
  post: PostInterface;
}

interface State {
  commenting: boolean;
  body: string;
  message: string;
}

class CommentForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      commenting: false,
      body: '',
      message: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // change commenting to true or false
  changeCommenting = () => {
    this.setState((prevState: any) => ({
      commenting: !prevState.commenting
    }));
  };

  handleSubmit = (e: any, postId: string) => {
    e.preventDefault();
    axios
      .post(`/api/posts/${postId}/comments`, {
        body: this.state.body,
        user: this.props.user.firstName + ' ' + this.props.user.lastName
      })
      .then(res => {
        if (res.data.type === 'error') {
          this.setState({
            message: res.data.message
          });
          console.log(`error ${res.data.message}`);
        } else {
          this.props.refreshPosts(res.data);
        }
      })
      .then(() => {
        this.changeCommenting();
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: err
        });
      });
  };

  render() {
    let form;
    let postId: string = this.props.post._id;
    form = (
      <div className='comment-form-div'>
        <form onSubmit={(e: any) => this.handleSubmit(e, postId)}>
          <div className='comment-button-div'>
            <button
              className='fav-button below-image-button'
              value='cancel'
              onClick={this.changeCommenting}
            >
              <CloseIcon width={'1.3rem'} />
            </button>
          </div>
          <div className='comment-input-container'>
            <input
              onChange={this.handleInputChange}
              value={this.state.body}
              name='body'
              id='body'
              className='input'
              type='text'
              pattern='.+'
              required
            />
            <label className='label' htmlFor='body'>
              comment
            </label>
          </div>
        </form>
      </div>
    );

    return <>{form}</>;
  }
}

export default CommentForm;
