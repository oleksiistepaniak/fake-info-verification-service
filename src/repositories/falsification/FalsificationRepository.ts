import { BadRequestException, Injectable } from '@nestjs/common';
import { AppDb } from '../../database/AppDatabase';
import { FalsificationRecord } from '../../database/records/FalsificationRecord';
import { ClientSession, ObjectId } from 'mongodb';
import { MongoHelper } from '../../helpers/MongoHelper';

@Injectable()
export class FalsificationRepository {
  constructor(private readonly db: AppDb) {}

  async create(
    session: ClientSession,
    falsification: FalsificationRecord,
  ): Promise<FalsificationRecord> {
    try {
      const result = await this.db.falsificationsCollection.insertOne(
        falsification,
        {
          session,
        },
      );
      return await this.get(session, result.insertedId);
    } catch (e) {
      if (MongoHelper.isUniqueError(e, 'text')) {
        throw new BadRequestException('text_not_unique');
      }
      throw e;
    }
  }

  async get(
    session: ClientSession,
    id: ObjectId,
  ): Promise<FalsificationRecord> {
    const result = await this.db.falsificationsCollection.findOne(
      { _id: id },
      { session },
    );
    if (!result) throw new BadRequestException('falsification_not_found');
    return result;
  }

  async findByText(
    session: ClientSession,
    text: string,
  ): Promise<FalsificationRecord | null> {
    return await this.db.falsificationsCollection.findOne(
      { text },
      { session },
    );
  }
}
