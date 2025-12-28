import { redirect } from 'next/navigation';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import type { InvestmentAccount } from '@/lib/types';
import { DashboardHeader } from './components/DashboardHeader';
import { AccountList } from './components/AccountList';

async function getAccounts(userId: string): Promise<InvestmentAccount[]> {
  const accountsRef = collection(db, 'accounts');
  const q = query(accountsRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InvestmentAccount));
}

export default async function DashboardPage() {
  const user = auth.currentUser;
  
  // This check is for server-side rendering, the layout protects the client-side
  if (!user) {
    redirect('/login');
  }

  const accounts = await getAccounts(user.uid);

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader name={user.displayName || user.email || 'User'} />
      <AccountList initialAccounts={accounts} />
    </div>
  );
}
