'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createInvestmentAccount } from '@/app/actions/accounts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Create Account
    </Button>
  );
}

export function CreateAccountForm() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const createAccountWithUserId = createInvestmentAccount.bind(null, user!.uid);
  const [state, formAction] = useFormState(createAccountWithUserId, { message: '', success: false });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success!' : 'Uh oh!',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        setOpen(false);
        router.refresh();
      }
    }
  }, [state, toast, router]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Investment Account</DialogTitle>
          <DialogDescription>
            Choose the type of account you want to open.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountType" className="text-right">
                Type
              </Label>
              <Select name="accountType" required defaultValue="GIA">
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GIA">General Investment Account (GIA)</SelectItem>
                  <SelectItem value="ISA">Stocks & Shares ISA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
