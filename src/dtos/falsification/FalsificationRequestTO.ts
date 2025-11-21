import { IsString, MinLength } from 'class-validator';

export class FalsificationRequestTO {
  @IsString()
  @MinLength(50, { message: 'invalid_text_length' })
  text: string;
}
