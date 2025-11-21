import { IsString, MinLength } from 'class-validator';

export class FalsificationRequestTO {
  @IsString({ message: 'invalid_text_type' })
  @MinLength(50, { message: 'invalid_text_length' })
  text: string;
}
