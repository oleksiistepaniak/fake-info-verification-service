import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppDb } from '../../database/AppDatabase';
import { FalsificationRepository } from '../../repositories/falsification/FalsificationRepository';
import { ObjectId } from 'mongodb';
import { FalsificationRecord } from '../../database/records/FalsificationRecord';
import { NO_SESSION } from '../../constants';

describe('FalsificationRepository.test', () => {
  let falsificationRepository: FalsificationRepository;
  let appDb: AppDb;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [],
      providers: [AppDb, FalsificationRepository],
    }).compile();

    falsificationRepository = app.get<FalsificationRepository>(
      FalsificationRepository,
    );
    appDb = app.get<AppDb>(AppDb);
  });

  describe('create', () => {
    beforeEach(async () => {
      await appDb.falsificationsCollection.deleteMany({});
    });

    it('should create a new falsification record', async () => {
      const falsification: FalsificationRecord = {
        _id: new ObjectId(),
        isFake: true,
        confidenceScore: 0.9,
        modelInfo: 'mock-model',
        text: 'This is a fake news',
        createdAt: new Date(),
      };

      let falsifications = await appDb.falsificationsCollection
        .find()
        .toArray();

      expect(falsifications).toHaveLength(0);

      const result = await falsificationRepository.create(
        NO_SESSION,
        falsification,
      );

      falsifications = await appDb.falsificationsCollection.find().toArray();

      expect(falsifications).toHaveLength(1);

      expect(result).toEqual(falsification);
    });

    it('should throw a unique error', async () => {
      const falsification: FalsificationRecord = {
        _id: new ObjectId(),
        isFake: true,
        confidenceScore: 0.9,
        modelInfo: 'mock-model',
        text: 'This is a fake news',
        createdAt: new Date(),
      };

      let falsifications = await appDb.falsificationsCollection
        .find()
        .toArray();

      expect(falsifications).toHaveLength(0);

      await appDb.falsificationsCollection.insertOne(falsification);

      falsifications = await appDb.falsificationsCollection.find().toArray();

      expect(falsifications).toHaveLength(1);

      expect(falsifications[0]).toEqual(falsification);

      await expect(
        falsificationRepository.create(NO_SESSION, {
          ...falsification,
          _id: new ObjectId(),
        }),
      ).rejects.toThrow('text_not_unique');
    });
  });

  describe('get', () => {
    const falsification: FalsificationRecord = {
      _id: new ObjectId(),
      isFake: true,
      confidenceScore: 0.9,
      modelInfo: 'mock-model',
      text: 'This is a fake news',
      createdAt: new Date(),
    };

    beforeEach(async () => {
      await appDb.falsificationsCollection.deleteMany({});
    });

    it('should return a falsification record', async () => {
      await appDb.falsificationsCollection.insertOne(falsification);

      const result = await falsificationRepository.get(
        NO_SESSION,
        falsification._id,
      );

      expect(result).toEqual(falsification);
    });

    it('should throw an error if the falsification is not found', async () => {
      await expect(
        falsificationRepository.get(NO_SESSION, new ObjectId()),
      ).rejects.toThrow('falsification_not_found');
    });
  });

  describe('findByText', () => {
    const falsification: FalsificationRecord = {
      _id: new ObjectId(),
      isFake: true,
      confidenceScore: 0.9,
      modelInfo: 'mock-model',
      text: 'This is a fake news',
      createdAt: new Date(),
    };

    beforeEach(async () => {
      await appDb.falsificationsCollection.deleteMany({});
    });

    it('should return a falsification record', async () => {
      await appDb.falsificationsCollection.insertOne(falsification);
      const result = await falsificationRepository.findByText(
        NO_SESSION,
        falsification.text,
      );
      expect(result).toEqual(falsification);
    });
  });
});
