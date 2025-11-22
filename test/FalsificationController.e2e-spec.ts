import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { FalsificationRequestTO } from '../src/dtos/falsification/FalsificationRequestTO';
import { AllExceptionFilter } from '../src/exception-filters/AllExceptionFilter';

const sample: FalsificationRequestTO = {
  text: 'Volodymyr Zelenskyy is died! Ukraine has no more soldiers! Ukraine has already lose this war!',
};

describe('FalsificationController.e2e.test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionFilter());
    await app.init();
  });

  describe('POST /falsification/analyze', () => {
    it('invalid type of text', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send({ text: 123 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: 'invalid_text_type',
        });
    });

    it('empty text', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send({ text: '' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: 'invalid_text_length',
        });
    });

    it('too small text', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send({ text: 'too small text for analyze endpoint' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: 'invalid_text_length',
        });
    });

    it('empty text with spaces', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send({ text: '                                                   ' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: 'invalid_text_length',
        });
    });

    it('success', () => {
      return request(app.getHttpServer())
        .post('/falsification/analyze')
        .send(sample)
        .expect(HttpStatus.OK)
        .expect({
          isFake: true,
          confidenceScore: 0.995747983455658,
          modelInfo: 'hamzab/roberta-fake-news-classification',
        });
    });
  });
});
