export type KYCStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
  uid: string;
  email: string;
  name?: string;
  kyc_status: KYCStatus;
  address?: string;
  dob?: string;
  governmentId?: string;
  createdAt: Date;
}

export interface InvestmentAccount {
  id: string;
  userId: string;
  type: 'ISA' | 'GIA';
  status: 'active' | 'pending' | 'closed';
  balance: number;
  brokerageAccountId: string;
  createdAt: Date;
}

export interface Investment {
  id: string;
  accountId: string;
  amountInvested: number;
  startDate: Date;
  currentValue: number;
  createdAt: Date;
}
