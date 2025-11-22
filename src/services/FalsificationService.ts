import { Injectable } from '@nestjs/common';
import { InferenceClient } from '@huggingface/inference';
import { ConfigService } from '@nestjs/config';
import { FalsificationResponseTO } from '../dtos/falsification/FalsificationResponseTO';
import { TextClassificationOutput } from '@huggingface/tasks/src/tasks/text-classification/inference';
import { TModelType } from '../types';

@Injectable()
export class FalsificationService {
  private client: InferenceClient;

  private readonly MODEL_ID: TModelType =
    'hamzab/roberta-fake-news-classification';

  constructor(private configService: ConfigService) {
    this.client = new InferenceClient(
      this.configService.get<string>('HF_TOKEN'),
    );
  }

  async detectFakeNews(text: string): Promise<FalsificationResponseTO> {
    let classifications: TextClassificationOutput;

    try {
      classifications = await this.client.textClassification({
        model: this.MODEL_ID,
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

    return {
      isFake: fakeLabel.score > trueLabel.score,
      confidenceScore: fakeLabel.score,
      modelInfo: this.MODEL_ID,
    };
  }
}
