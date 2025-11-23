export type TModelType = 'hamzab/roberta-fake-news-classification';

export type TAuthType = 'google';

export interface IAuthGoogleUser {
  provider: TAuthType;
  providerId: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

declare module 'express' {
  interface Request {
    user: IAuthGoogleUser;
  }
}

export interface IGoogleCredentialStruct {
  familyName: string;
  givenName: string;
}

export interface IGooglePhotoStruct {
  value: string;
}

export interface IGoogleEmailStruct {
  value: string;
  verified: boolean;
}

export interface IGoogleProfile {
  id: string;
  displayName: string;
  name: IGoogleCredentialStruct;
  photos: IGooglePhotoStruct[];
  provider: TAuthType;
  emails: IGoogleEmailStruct[];
}
