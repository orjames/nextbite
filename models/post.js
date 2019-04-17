const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    publicId: {
      type: String,
      required: true,
      minlength: [1, 'PhotoId must be between 1 and 99 characters'],
      maxlength: [99, 'PhotoId must be between 1 and 99 characters'],
    },
    caption: {
      type: String,
      required: true,
      minlength: [1, 'Caption must be between 1 and 99 characters'],
      maxlength: [99, 'Caption must be between 1 and 99 characters'],
    },
    location: Object,
    company: {
      type: String,
      required: true,
      minlength: [1, 'restaurant name must be between 1 and 99 characters'],
      maxlength: [99, 'restaurant name must be between 1 and 99 characters'],
    },
    tags: [String],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
