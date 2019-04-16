const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    publicId: {
      type: String,
      required: true,
      minlength: [1, 'First Name must be between 1 and 99 characters'],
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
      minlength: [1, 'Company name must be between 1 and 99 characters'],
      maxlength: [99, 'First Name must be between 1 and 99 characters'],
    },
    tags: [String],
    // default: function() {
    //   return new Date().getHours();
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Post', postSchema);
