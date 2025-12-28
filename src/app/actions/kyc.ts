'use server';

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { simulateKYCCheck, SimulateKYCCheckInput } from '@/ai/flows/simulate-kyc-check';
import type { KYCStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';

type KYCFormState = {
  message: string;
  success: boolean;
  status?: KYCStatus;
};

export async function initiateKYC(userId: string, prevState: KYCFormState, formData: FormData): Promise<KYCFormState> {
  const kycData: SimulateKYCCheckInput = {
    userId: userId,
    name: formData.get('name') as string,
    address: formData.get('address') as string,
    dob: formData.get('dob') as string,
    governmentId: formData.get('governmentId') as string,
  };

  try {
    // Call the Genkit flow to simulate the KYC check
    const result = await simulateKYCCheck(kycData);

    // Update user document in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      kyc_status: result.isApproved ? 'approved' : 'rejected',
      name: kycData.name,
      address: kycData.address,
      dob: kycData.dob,
      governmentId: kycData.governmentId,
    });
    
    revalidatePath('/profile');
    revalidatePath('/dashboard');

    return {
      message: result.reason,
      success: true,
      status: result.isApproved ? 'approved' : 'rejected',
    };
  } catch (error: any) {
    return {
      message: `An error occurred: ${error.message}`,
      success: false,
    };
  }
}
