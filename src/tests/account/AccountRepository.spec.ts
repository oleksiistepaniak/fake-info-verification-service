import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppDb } from '../../database/AppDatabase';
import { ObjectId } from 'mongodb';
import { NO_SESSION } from '../../constants';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { AccountRecord } from '../../database/records/AccountRecord';

describe('AccountRepository.test', () => {
  let accountRepository: AccountRepository;
  let appDb: AppDb;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [],
      providers: [AppDb, AccountRepository],
    }).compile();

    accountRepository = app.get<AccountRepository>(AccountRepository);
    appDb = app.get<AppDb>(AppDb);
  });

  describe('create', () => {
    beforeEach(async () => {
      await appDb.accountsCollection.deleteMany({});
    });

    it('should create a new account record', async () => {
      const account: AccountRecord = {
        _id: new ObjectId(),
        email: 'john@gmail.com',
        authType: 'google',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
      };

      let accounts = await appDb.accountsCollection.find().toArray();

      expect(accounts).toHaveLength(0);

      const result = await accountRepository.create(NO_SESSION, account);

      accounts = await appDb.accountsCollection.find().toArray();

      expect(accounts).toHaveLength(1);

      expect(result).toEqual(account);
    });

    it('should throw a unique error', async () => {
      const account: AccountRecord = {
        _id: new ObjectId(),
        email: 'john@gmail.com',
        authType: 'google',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: new Date(),
      };

      let accounts = await appDb.accountsCollection.find().toArray();

      expect(accounts).toHaveLength(0);

      await appDb.accountsCollection.insertOne(account);

      accounts = await appDb.accountsCollection.find().toArray();

      expect(accounts).toHaveLength(1);

      expect(accounts[0]).toEqual(account);

      await expect(
        accountRepository.create(NO_SESSION, {
          ...account,
          _id: new ObjectId(),
        }),
      ).rejects.toThrow('email_not_unique');
    });
  });

  describe('get', () => {
    const account: AccountRecord = {
      _id: new ObjectId(),
      email: 'john@gmail.com',
      authType: 'google',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
    };

    beforeEach(async () => {
      await appDb.accountsCollection.deleteMany({});
    });

    it('should return a falsification record', async () => {
      await appDb.accountsCollection.insertOne(account);

      const result = await accountRepository.get(NO_SESSION, account._id);

      expect(result).toEqual(account);
    });

    it('should throw an error if the falsification is not found', async () => {
      await expect(
        accountRepository.get(NO_SESSION, new ObjectId()),
      ).rejects.toThrow('account_not_found');
    });
  });

  describe('findByEmail', () => {
    const account: AccountRecord = {
      _id: new ObjectId(),
      email: 'john@gmail.com',
      authType: 'google',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
    };

    beforeEach(async () => {
      await appDb.accountsCollection.deleteMany({});
    });

    it('should return a falsification record', async () => {
      await appDb.accountsCollection.insertOne(account);
      const result = await accountRepository.findByEmail(
        NO_SESSION,
        account.email,
      );
      expect(result).toEqual(account);
    });
  });
});
