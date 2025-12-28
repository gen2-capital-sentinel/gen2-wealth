'use server';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import type { UserProfile } from '@/lib/types';

type FormState = {
  message: string;
  success: boolean;
};

async function createUserProfile(user: import('firebase/auth').User) {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const newUserProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      name: user.displayName || '',
      kyc_status: 'pending',
      createdAt: new Date(),
    };
    await setDoc(userRef, {
      ...newUserProfile,
      createdAt: serverTimestamp(),
    });
  }
}

export async function signUpWithEmail(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { message: 'Passwords do not match.', success: false };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(userCredential.user);
    return { message: 'Account created successfully!', success: true };
  } catch (error: any) {
    return { message: error.message, success: false };
  }
}

export async function signInWithEmail(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { message: 'Signed in successfully!', success: true };
  } catch (error: any) {
    return { message: error.message, success: false };
  }
}

export async function signInWithGoogle(): Promise<FormState> {
  // This function is called from the client, but the logic inside runs on the client.
  // The 'use server' directive at the top is for the file, but this specific function
  // will be executed where it's called if it uses browser-specific APIs.
  // The actual popup logic is client-side. We are wrapping it in a server action file for organization.
  try {
    const provider = new GoogleAuthProvider();
    // This is a client-side operation. The function must be called in a client component.
    const result = await signInWithPopup(auth, provider);
    await createUserProfile(result.user);
    return { message: 'Signed in with Google successfully!', success: true };
  } catch (error: any) {
    return { message: error.message, success: false };
  }
}


export async function signOutUser(): Promise<void> {
  await signOut(auth);
}
