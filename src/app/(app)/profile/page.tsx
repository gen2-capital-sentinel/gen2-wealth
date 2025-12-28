import { redirect } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import type { UserProfile } from '@/lib/types';
import { ProfileHeader } from './components/ProfileHeader';
import { KYCStatus } from './components/KYCStatus';
import { KYCForm } from './components/KYCForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
}

export default async function ProfilePage() {
  const user = auth.currentUser;

  if (!user) {
    redirect('/login');
  }

  const userProfile = await getUserProfile(user.uid);

  if (!userProfile) {
    // This case should ideally not happen if profile is created on sign up
    return <div>User profile not found.</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader name={userProfile.name || user.email!} />
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <KYCStatus status={userProfile.kyc_status} />
        </div>
        <div className="md:col-span-2">
          {userProfile.kyc_status !== 'approved' && (
             <Card>
                <CardHeader>
                    <CardTitle>Submit KYC Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <KYCForm userProfile={userProfile} />
                </CardContent>
             </Card>
          )}
          {userProfile.kyc_status === 'approved' && (
            <Card className="flex h-full items-center justify-center bg-success/10 border-success/20">
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium text-success">Your identity has been verified.</p>
                <p className="text-muted-foreground">You can now access all investment features.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
