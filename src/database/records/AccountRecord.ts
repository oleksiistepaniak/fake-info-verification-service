import { ObjectId } from 'mongodb';

export interface AccountRecord {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  authType: 'google';
  email: string;
  createdAt: Date;
}
