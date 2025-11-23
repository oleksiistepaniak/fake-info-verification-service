import { Injectable } from '@nestjs/common';
import { AccountRepository } from '../../repositories/account/AccountRepository';
import { AppDb } from '../../database/AppDatabase';
import { AccountRecord } from '../../database/records/AccountRecord';
import { IAuthGoogleUser } from '../../types';
import { ObjectId } from 'mongodb';

@Injectable()
export class AccountService {
  constructor(
    private readonly db: AppDb,
    private readonly accountRepository: AccountRepository,
  ) {}

  async findOrCreateAccount(
    googleUser: IAuthGoogleUser,
  ): Promise<AccountRecord> {
    return await this.db.withTransaction(async (session) => {
      let account = await this.accountRepository.findByEmail(
        session,
        googleUser.email,
      );

      if (account) return account;

      account = {
        _id: new ObjectId(),
        email: googleUser.email,
        authType: 'google',
        firstName: googleUser.firstName,
        lastName: googleUser.lastName,
        createdAt: new Date(),
      };
      await this.accountRepository.create(session, account);
      return account;
    });
  }
}
