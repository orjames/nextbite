import React, { Component } from 'react';
import axios from 'axios';
import CommentIcon from './images/comment-regular';
import PlusIcon from './images/plus-solid';

class FeedCreateComment extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      commenting: false,
      body: '',
      message: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // change commenting to true or false
  changeCommenting = () => {
    this.setState((prevState: any) => ({
      commenting: !prevState.commenting,
    }));
  };

  handleSubmit = (e: any, postId: string) => {
    e.preventDefault();
    axios
      .post(`/api/posts/${postId}/comments`, {
        body: this.state.body,
        user: this.props.user.firstName + ' ' + this.props.user.lastName,
      })
      .then((res) => {
        if (res.data.type === 'error') {
          this.setState({
            message: res.data.message,
          });
          console.log(`error ${res.data.message}`);
        } else {
          this.props.refreshPosts(res.data);
        }
      })
      .then(() => {
        this.changeCommenting();
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          message: err,
        });
      });
  };

  render() {
    let form;
    let postId: string = this.props.post._id;
    if (this.state.commenting) {
      form = (
        <div>
          <form onSubmit={(e: any) => this.handleSubmit(e, postId)}>
            <input
              onChange={this.handleInputChange}
              value={this.state.comment}
              type='text'
              name='body'
              placeholder='comment...'
              required
            />
            <br />
            <input className='button' type='submit' value='create comment' />
          </form>
          <button onClick={this.changeCommenting}>cancel</button>
        </div>
      );
    } else {
      form = (
        <div className='flex row align-center'>
          <button className='fav-button' onClick={this.changeCommenting}>
            <PlusIcon width={'1.3rem'} />
            <CommentIcon width={'1.3rem'} />
          </button>
        </div>
      );
    }

    return <div className='ml-2'>{form}</div>;
  }
}

export default FeedCreateComment;
