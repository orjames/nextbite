const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const formData = require('express-form-data');
const cors = require('cors');
require('dotenv').config();
const User = require('../models/user');
const Post = require('../models/post');

// image stuff below
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
// image stuff above

// GET /users/:id - GET one user
router.get('/users/:id', (req, res) => {
  User.findById(req.params.id)
    .populate('posts')
    .exec((err, user) => {
      if (!err) {
        res.status(200).json(user);
      } else {
        res.status(500).json(err);
      }
    });
});

// GET /posts - get all posts
router.get('/posts', (req, res) => {
  Post.find({}, (err, posts) => {
    if (!err) {
      res.status(200).json(posts);
    } else {
      res.status(500).json(err);
    }
  });
});

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

module.exports = router;
