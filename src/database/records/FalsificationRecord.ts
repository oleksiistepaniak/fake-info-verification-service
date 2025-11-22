import { ObjectId } from 'mongodb';

export interface FalsificationRecord {
  _id: ObjectId;
  text: string;
  isFake: boolean;
  modelInfo: string;
  confidenceScore: number;
  createdAt: Date;
}
