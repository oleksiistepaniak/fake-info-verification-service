import {
  ClientSession,
  Collection,
  Db,
  MongoClient,
  OptionalId,
  WithoutId,
} from 'mongodb';
import { ConfigService } from '@nestjs/config';
import { FalsificationRecord } from './records/FalsificationRecord';
import { Injectable } from '@nestjs/common';
import { AccountRecord } from './records/AccountRecord';

@Injectable()
export class AppDb {
  private readonly _client: MongoClient;
  private readonly _db: Db;
  private readonly _falsificationsCollection: Collection<
    OptionalId<FalsificationRecord>
  >;
  private readonly _accountsCollection: Collection<OptionalId<AccountRecord>>;

  constructor(private readonly configService: ConfigService) {
    this._client = new MongoClient(this.configService.get<string>('DB_URL'));
    this._db = this._client.db();
    this._falsificationsCollection = this._db.collection('falsifications');
    this._accountsCollection = this._db.collection('accounts');
  }

  get falsificationsCollection(): Collection<WithoutId<FalsificationRecord>> {
    return this._falsificationsCollection;
  }

  get accountsCollection(): Collection<WithoutId<AccountRecord>> {
    return this._accountsCollection;
  }

  async withTransaction(
    callback: (session: ClientSession) => Promise<any>,
  ): Promise<any> {
    return this._client.withSession(async (session) => {
      return session.withTransaction(async (transactionalSession) => {
        return await callback(transactionalSession);
      });
    });
  }

  async initializeDatabase() {
    try {
      console.log(
        `Connecting to Mongo to URL: ${this.configService.get<string>('DB_URL')}`,
      );
      await this._client.connect();
      await this._accountsCollection.createIndex(
        { email: 1 },
        { unique: true },
      );
      await this._falsificationsCollection.createIndex(
        { text: 1 },
        { unique: true },
      );
      console.log(
        `Connection with Mongo DB successfully established! URL: ${this.configService.get<string>('DB_URL')}`,
      );
    } catch (error) {
      console.error(`Attempt to connect to Mongo DB failed!`, error);
      throw new Error('mongo_db_connection_error');
    }
  }
}
