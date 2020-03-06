import React, { Component } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import Spinner from './Spinner';
import Images from './Images';
import Buttons from './Buttons';
import TagsInput from './TagsInput';
import PlusIcon from './images/plus-solid';
import ImageIcon from './images/image-solid';

class CreatePost extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      uploading: false,
      images: [],
      publicId: '',
      caption: '',
      tags: [],
      message: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTagsChange = this.handleTagsChange.bind(this);
  }

  handleInputChange = (e: any) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleTagsChange = (e: any, num: number) => {
    let tags = this.state.tags;
    tags[num] = e.target.value;
    this.setState({
      tags: tags
    });
  };

  handleSubmit = (e: any, userId: string) => {
    e.preventDefault();
    axios
      .post(`/api/users/${userId}/posts`, {
        publicId: this.state.publicId,
        caption: this.state.caption,
        location: this.props.userLocation,
        tags: this.state.tags,
        company: this.props.user.company,
        favorite: false
      })
      .then(res => {
        if (res.data.type === 'error') {
          this.setState({
            message: res.data.message
          });
          console.log(`error ${res.data.message}`);
        } else {
          console.log(res);
          this.props.history.push('/');
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: err
        });
      });
  };

  // Extracting the files to be uploaded out of the DOM and shipping them
  // off to our server in a fetch request.
  // updates the state of our application
  // to show that something is happening (spinner) or show the images when they come back successfully.
  upload = (e: any) => {
    const errs: any[] = [];
    const files = Array.from(e.target.files);
    // limits to one upload img
    if (files.length > 1) {
      const msg = 'upload only 1 img at a time';
    }
    const formData = new FormData();
    const types = ['image/png', 'image/jpeg', 'image/gif'];
    files.forEach((file: any, index: any) => {
      // filtering to make sure only correct img format
      if (types.every(type => file.type !== type)) {
        errs.push(`'${file.type}' is not a supported format`);
      }
      // filter by file size
      if (file.size > 21000000) {
        errs.push(`'${file.name}' is too large, pick smaller file`);
      }
      formData.append(index, file);
    });
    if (errs.length) {
      return errs.forEach(error => console.log(error));
    }
    this.setState({ uploading: true });
    fetch(`api/image-upload`, { method: 'POST', body: formData })
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(images => {
        this.setState({
          uploading: false,
          images: images,
          publicId: images[0].public_id
        });
      })
      .catch(err => {
        console.log(err.message);
        this.setState({ uploading: false });
      });
  };

  // This allows us to pull images off the DOM and put the application
  // back in the state where we can upload more images.
  // Its also helpful to deal with errors that happen in the application.
  removeImage = (id: any) => {
    this.setState({ images: [] });
  };
  onError = (id: any) => {
    console.log('something went wrong');
    this.setState({ images: [] });
  };

  render() {
    const userId = this.props.user._id;
    const { loading, uploading, images } = this.state;
    let form;
    const uploader = () => {
      switch (true) {
        case uploading:
          return (
            <div>
              <Spinner />
            </div>
          );
        case images.length > 0:
          return (
            <Images
              images={images}
              removeImage={this.removeImage}
              onError={this.onError}
              className='image'
            />
          );
        default:
          return <Buttons upload={this.upload} />;
      }
    };

    let select;
    if (this.state.tags.length === 0) {
      select = (
        <div>
          <TagsInput num={0} handleTagsChange={this.handleTagsChange} />
        </div>
      );
    } else if (this.state.tags.length === 1) {
      select = (
        <div>
          <TagsInput num={0} handleTagsChange={this.handleTagsChange} />
          <TagsInput num={1} handleTagsChange={this.handleTagsChange} />
        </div>
      );
    } else {
      select = (
        <div>
          <TagsInput num={0} handleTagsChange={this.handleTagsChange} />
          <TagsInput num={1} handleTagsChange={this.handleTagsChange} />
          <TagsInput num={2} handleTagsChange={this.handleTagsChange} />
        </div>
      );
    }

    if (this.state.publicId && this.state.uploading === false) {
      form = (
        <div className='form-post-div'>
          <form onSubmit={(e: any) => this.handleSubmit(e, userId)}>
            <div className='input-container'>
              <input
                onChange={this.handleInputChange}
                value={this.state.caption}
                name='caption'
                id='caption'
                className='input'
                type='text'
                pattern='.+'
                required
              />
              <label className='label' htmlFor='caption'>
                caption
              </label>
            </div>
            {select}
            <button className='fav-button' type='submit' value='create post'>
              <PlusIcon width={'1.3rem'} />
              <ImageIcon width={'1.3rem'} />
            </button>
          </form>
        </div>
      );
    } else {
      form = null;
    }

    return (
      <div className='create-post-div'>
        <div className='toggle fancy'>create a new post:</div>
        {uploader()}
        {form}
      </div>
    );
  }
}

export default withRouter(CreatePost);
