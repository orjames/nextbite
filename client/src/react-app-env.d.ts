/// <reference types="react-scripts" />

export interface ILocation {
  lat: number;
  long: number;
  accuracy: number;
}

export interface IPost {
  caption: string;
  company: string;
  createdAt: string;
  location: ILocation;
  publicId: string;
  tags: string[];
  updatedAt: Date;
  _id: string;
}

export interface IComment {
  body: string;
  createdAt: Date;
  updatedAt: Date;
  user: string;
}
