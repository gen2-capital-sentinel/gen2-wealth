'use server';

import { collection, addDoc, serverTimestamp, doc, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { InvestmentAccount, UserProfile } from '@/lib/types';
import { revalidatePath } from 'next/cache';

type ActionState = {
  message: string;
  success: boolean;
};

// Simulate calling a prime brokerage API to create an account
async function simulateBrokerageAccountCreation(accountType: 'ISA' | 'GIA'): Promise<string> {
  // In a real app, this would be an API call.
  // We simulate a delay and return a random-looking ID.
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `${accountType}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export async function createInvestmentAccount(userId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const accountType = formData.get('accountType') as 'ISA' | 'GIA';

  if (!userId) {
    return { message: 'User not authenticated.', success: false };
  }
  
  if (!accountType || !['ISA', 'GIA'].includes(accountType)) {
    return { message: 'Invalid account type selected.', success: false };
  }

  try {
    const brokerageAccountId = await simulateBrokerageAccountCreation(accountType);

    await addDoc(collection(db, 'accounts'), {
      userId,
      type: accountType,
      status: 'active',
      balance: 0,
      brokerageAccountId,
      createdAt: serverTimestamp(),
    });
    
    revalidatePath('/dashboard');

    return { message: `${accountType} account created successfully.`, success: true };
  } catch (error: any) {
    return { message: `Error creating account: ${error.message}`, success: false };
  }
}

// Simulate calling prime brokerage API to execute investment
async function simulateInvestmentExecution(amount: number): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  // In a real app, you'd handle success/failure from the API
  return true; 
}


export async function initiateInvestment(accountId: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
  const amountStr = formData.get('amount') as string;
  const amount = parseFloat(amountStr);

  if (isNaN(amount) || amount <= 0) {
    return { message: 'Invalid investment amount.', success: false };
  }

  const accountRef = doc(db, 'accounts', accountId);

  try {
    // Check user's KYC status within a transaction to ensure data consistency
    const newBalance = await runTransaction(db, async (transaction) => {
      const accountDoc = await transaction.get(accountRef);
      if (!accountDoc.exists()) {
        throw new Error('Investment account not found.');
      }
      
      const accountData = accountDoc.data() as InvestmentAccount;
      const userRef = doc(db, 'users', accountData.userId);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found.');
      }

      const userData = userDoc.data() as UserProfile;
      if (userData.kyc_status !== 'approved') {
        throw new Error('KYC not approved. Please complete your profile verification before investing.');
      }
      
      // All checks passed, proceed with investment logic
      const investmentSuccess = await simulateInvestmentExecution(amount);
      if (!investmentSuccess) {
        throw new Error('Investment failed at prime brokerage.');
      }
      
      // Update account balance
      const updatedBalance = accountData.balance + amount;
      transaction.update(accountRef, { balance: updatedBalance });

      // Create investment record
      const investmentColRef = collection(db, 'investments');
      const newInvestment = {
        accountId: accountId,
        amountInvested: amount,
        startDate: serverTimestamp(),
        currentValue: amount, // Initially same as invested amount
        createdAt: serverTimestamp(),
      };
      transaction.set(doc(investmentColRef), newInvestment);

      return updatedBalance;
    });

    revalidatePath('/dashboard');
    return { message: `Successfully invested $${amount.toFixed(2)}. New balance is $${newBalance.toFixed(2)}.`, success: true };

  } catch (error: any) {
    return { message: `Investment failed: ${error.message}`, success: false };
  }
}
