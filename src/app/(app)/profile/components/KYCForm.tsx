'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initiateKYC } from '@/app/actions/kyc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Submit for Verification
    </Button>
  );
}

export function KYCForm({ userProfile }: { userProfile: UserProfile }) {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const kycWithUserId = initiateKYC.bind(null, user!.uid);
  const [state, formAction] = useFormState(kycWithUserId, { message: '', success: false, status: 'pending' });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? `KYC Status: ${state.status}` : 'Uh oh!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        router.refresh();
      }
    }
  }, [state, toast, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" defaultValue={userProfile.name || ''} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Input id="dob" name="dob" type="date" defaultValue={userProfile.dob || ''} required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Full Address</Label>
        <Textarea id="address" name="address" defaultValue={userProfile.address || ''} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="governmentId">Government ID Number</Label>
        <Input id="governmentId" name="governmentId" defaultValue={userProfile.governmentId || ''} placeholder="e.g., Passport or Driver's License number" required />
      </div>
      <SubmitButton />
    </form>
  );
}
