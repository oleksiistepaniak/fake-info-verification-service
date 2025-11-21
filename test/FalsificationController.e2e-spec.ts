import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { FalsificationRequestTO } from '../src/dtos/falsification/FalsificationRequestTO';

const sample: FalsificationRequestTO = {
  text: 'Уряд ввів податок на повітря для власників електросамокатів з 1 березня, це викликало масові протести екологічних активістів по всій країні.',
};

describe('FalsificationController.e2e.test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /falsification/analyze', () => {
    it('invalid type of text', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send({ text: 123 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          error: 'Bad Request',
          statusCode: 400,
          message: ['invalid_text_length', 'invalid_text_type'],
        });
    });

    it('empty text', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send({ text: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          error: 'Bad Request',
          statusCode: 400,
          message: ['invalid_text_length'],
        });
    });

    it('too small text', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send({ text: 'too small text for analyze endpoint' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          error: 'Bad Request',
          statusCode: 400,
          message: ['invalid_text_length'],
        });
    });

    it('success', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send(sample)
        .expect(HttpStatus.OK)
        .expect({
          isFake: false,
          confidenceScore: 0.9,
          modelInfo: 'OpenAI GPT-3.5 Turbo',
        });
    });
  });
});
