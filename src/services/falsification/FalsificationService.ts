import { Injectable } from '@nestjs/common';
import { InferenceClient } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';
import { FalsificationResponseTO } from '../../dtos/falsification/FalsificationResponseTO';
import { AppDb } from '../../database/AppDatabase';
import { TextClassificationOutput } from '@huggingface/tasks/src/tasks/text-classification/inference';
import { FalsificationRecord } from '../../database/records/FalsificationRecord';
import { FalsificationRepository } from '../../repositories/falsification/FalsificationRepository';
import { ObjectId } from 'mongodb';
import { TModelType } from '../../types';

@Injectable()
export class FalsificationService {
  private readonly client: InferenceClient;

  private readonly modelId: TModelType;

  constructor(
    private configService: ConfigService,
    private readonly appDb: AppDb,
    private readonly falsificationRepository: FalsificationRepository,
  ) {
    this.client = new InferenceClient(
      this.configService.get<string>('HF_TOKEN'),
    );
    this.modelId = this.configService.get<TModelType>('ML_MODEL');
  }

  async detectFakeNews(text: string): Promise<FalsificationResponseTO> {
    return await this.appDb.withTransaction(async (session) => {
      let classifications: TextClassificationOutput;

      const existingRecord = await this.falsificationRepository.findByText(
        session,
        text,
      );

      if (existingRecord) {
        return {
          isFake: existingRecord.isFake,
          confidenceScore: existingRecord.confidenceScore,
          modelInfo: existingRecord.modelInfo,
        };
      }

      try {
        classifications = await this.client.textClassification({
          model: this.modelId,
          inputs: text,
        });
      } catch (e: unknown) {
        console.error('Error during text classification: ', e);
        throw new Error('error_during_text_classification');
      }

      const fakeLabel = classifications.find((c) => c.label === 'FAKE');
      const trueLabel = classifications.find((c) => c.label === 'TRUE');

      if (!fakeLabel || !trueLabel) {
        console.error('Model output (unexpected format):', classifications);
        throw new Error('miss_fake_or_true_label');
      }

      const record: FalsificationRecord = {
        _id: new ObjectId(),
        isFake: fakeLabel.score > trueLabel.score,
        confidenceScore: fakeLabel.score,
        modelInfo: this.modelId,
        text,
        createdAt: new Date(),
      };

      await this.falsificationRepository.create(session, record);
      return {
        isFake: record.isFake,
        confidenceScore: record.confidenceScore,
        modelInfo: record.modelInfo,
      };
    });
  }
}
