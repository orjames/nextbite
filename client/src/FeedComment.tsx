import React, { Component } from 'react';
import axios from 'axios';
import CommentIcon from './images/comment-regular';
import CloseIcon from './images/window-close-regular';
import CommentForm from './CommentForm';

class FeedComment extends React.Component<any, any> {
  constructor(props: any) {
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
    if (this.state.commenting) {
      form = (
        <div className='comment-form-div'>
          <form onSubmit={(e: any) => this.handleSubmit(e, postId)}>
            <div className='comment-button-div'>
              <button
                className='fav-button below-image-button'
                type='submit'
                value='submit'
              >
                <CommentIcon width={'1.3rem'} />
              </button>
              <button
                className='fav-button below-image-button'
                value='cancel'
                onClick={this.changeCommenting}
              >
                <CloseIcon width={'1.3rem'} />
              </button>
            </div>
            <CommentForm
              user={this.props.user}
              commenting={this.props.commenting}
              changeCommenting={this.props.changeCommenting}
              refreshPosts={this.props.refreshPosts}
              post={this.props.post}
            />
          </form>
        </div>
      );
    } else {
      form = (
        <div className='comment-button-div'>
          <button
            className='fav-button below-image-button'
            onClick={this.changeCommenting}
          >
            <CommentIcon width={'1.3rem'} />
          </button>
        </div>
      );
    }

    return <>{form}</>;
  }
}

export default FeedComment;
