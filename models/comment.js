const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
      minlength: [1, 'Comment must be between 1 and 99 characters'],
      maxlength: [99, 'Comment must be between 1 and 99 characters'],
    },
    user: {
      type: String,
      required: true,
      minlength: [1, 'User name must be between 1 and 99 characters'],
      maxlength: [99, 'User name must be between 1 and 99 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Comment', commentSchema);
