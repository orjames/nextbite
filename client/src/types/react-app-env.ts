export interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  message: string;
  isCompany: string;
  company: string;
  posts: object[];
}

export interface LocationInterface {
  lat: number;
  long: number;
  accuracy: number;
}

export interface PostInterface {
  caption: string;
  company: string;
  createdAt: string;
  location: LocationInterface;
  publicId: string;
  tags: string[];
  updatedAt: Date;
  _id: string;
}

export interface CommentInterface {
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: string;
}

export enum FeedOptions {
  'Feed' = 'Feed',
  'Favorites' = 'Favorites',
}

export interface LiftTokenInterface {
  token: string;
  user: UserInterface;
  message: string;
}