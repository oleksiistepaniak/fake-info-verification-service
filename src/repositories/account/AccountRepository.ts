import { BadRequestException, Injectable } from '@nestjs/common';
import { AppDb } from '../../database/AppDatabase';
import { ClientSession, ObjectId } from 'mongodb';
import { AccountRecord } from '../../database/records/AccountRecord';
import { MongoHelper } from '../../helpers/MongoHelper';

@Injectable()
export class AccountRepository {
  constructor(private readonly db: AppDb) {}

  async create(
    session: ClientSession,
    account: AccountRecord,
  ): Promise<AccountRecord> {
    try {
      const result = await this.db.accountsCollection.insertOne(account, {
        session,
      });
      return await this.get(session, result.insertedId);
    } catch (e) {
      if (MongoHelper.isUniqueError(e, 'email')) {
        throw new BadRequestException('email_not_unique');
      }
      throw e;
    }
  }

  async get(session: ClientSession, id: ObjectId): Promise<AccountRecord> {
    const result = await this.db.accountsCollection.findOne(
      { _id: id },
      { session },
    );
    if (!result) throw new BadRequestException('account_not_found');
    return result;
  }

  async findByEmail(
    session: ClientSession,
    email: string,
  ): Promise<AccountRecord | null> {
    return await this.db.accountsCollection.findOne({ email }, { session });
  }
}
