import React from 'react';
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext,
} from 'cloudinary-react';
require('dotenv').config();

const FeedImage = (props: any) => {
  return (
    <CloudinaryContext
      cloudName='orjames'
      api_key={process.env.REACT_APP_CLOUDINARY_API_KEY}
      api_secret={process.env.REACT_APP_CLOUDINARY_API_SECRET}
      className='flex center img-div'
    >
      <Image
        publicId={props.post.publicId}
        width='340'
        objectfit='contain'
        crop='scale'
        className='image'
      />
    </CloudinaryContext>
  );
};

export default FeedImage;
