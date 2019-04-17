const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const cors = require('cors');
require('dotenv').config();
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');

// image upload stuff below
// configuring cloudinary to user specific cloud name, API_KEY, and API_SECRET
cloudinary.config({
  cloud_name: 'orjames',
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
});
let clientOrigin =
  process.env.NODE_ENV === 'production'
    ? 'https://orj-mern-project.herokuapp.com'
    : 'http://localhost:3000';
router.use(
  cors({
    origin: clientOrigin,
  })
);
router.use(formData.parse());
// POST /image-upload posts the image
router.post('/image-upload', (req, res) => {
  const values = Object.values(req.files);
  const promises = values.map((image) =>
    cloudinary.uploader.upload(image.path)
  );
  Promise.all(promises)
    .then((results) => res.json(results))
    .catch((err) => res.status(400).json(err));
});
// image upload above

//
//
// PUT users/:userId/ - UPDATE one user to add favorites
router.put('/users/:userId/favorite', (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.userId },
    { $set: { favorites: req.body.favorites } },
    (err, user) => {
      console.log('in findByIdAndUpdate of update route');
      if (err) {
        throw err;
      } else {
        console.log('in the else statement of /:userId/posts/:pid');
        res.status(200).json(user);
      }
    }
  );
});

//
//
// GET /users/:id - GET one user
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .populate('favorites')
    .exec((err, user) => {
      if (!err) {
        res.status(200).json(user);
      } else {
        res.status(500).json(err);
      }
    });
});

//
//
// GET /users - get all users
router.get('/users', (req, res) => {
  User.find({}, (err, users) => {
    if (!err) {
      res.status(200).json(users);
    } else {
      res.status(500).json(err);
    }
  });
});

//
//
// GET /posts - get all posts
router.get('/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (!err) {
      res.status(200).json(posts);
    } else {
      res.status(500).json(err);
    }
  }).populate('comments');
});

//
//
// GET /users/:uid/posts - GET ALL posts associated with given user
router.get('/users/:uid/posts', (req, res) => {
  User.findById(req.params.uid)
    .populate('posts')
    .exec((err, user) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.json(user.posts); //res.json(user) for whole user object
      }
    });
});

//
//
// POST /users/:uid/posts - CREATES a new post for that user
router.post('/users/:uid/posts', (req, res) => {
  User.findById(req.params.uid)
    .populate('posts')
    .exec((err, user) => {
      let newPost = new Post({
        publicId: req.body.publicId,
        caption: req.body.caption,
        location: req.body.location,
        company: req.body.company,
        tags: req.body.tags,
      });
      newPost.save((err, post) => {
        user.posts.push(post);
        user.save((err, user) => {
          res.status(201).json(user);
        });
      });
    });
});

//
//
// GET /posts/:pid/comments - GET ALL comments associated with given post
router.get('/posts/:pid/comments', (req, res) => {
  Post.findById(req.params.pid)
    .populate('comments')
    .exec((err, post) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        res.json(post.comments); //res.json(post) for whole post object
      }
    });
});

//
//
// POST /posts/:pid/comments - CREATES a new comment for that post
router.post('/posts/:pid/comments', (req, res) => {
  console.log('\x1b[36m%s\x1b[0m', 'In POST /posts/:pid/comments');
  Post.findById(req.params.pid, (err, post) => {
    let newComment = new Comment({
      body: req.body.body,
      user: req.body.user,
    });
    newComment.save((err, comment) => {
      post.comments.push(comment);
      post.save((err, post) => {
        Post.find({})
          .populate('comments')
          .exec((err, posts) => {
            if (err) {
              return res.status(500).send(err);
            } else {
              res.json(posts);
            }
          });
      });
    });
  });
});

// DELETE profile/:userId/posts/:pid - DELETE ONE post associated with specific user
router.delete('/users/:userId/posts/:pid', (req, res) => {
  // let user = req.body.user;
  // if user didn't create post cant do the rest
  // res
  // .status(401)
  // .json({ type: 'error', message: 'you must be user who created the post to delete' });

  console.log('in the start of delete route');
  Post.findOneAndDelete({ _id: req.params.pid }, (err, post) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        throw err;
      } else {
        console.log('in the else statement of /:userId/posts/:pid');
        user.update({ $pull: { posts: { _id: req.params.pid } } });
        res.status(200).json({ message: 'it wokred' });
      }
    });
  });
});

module.exports = router;
