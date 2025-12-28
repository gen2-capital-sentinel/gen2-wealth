'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initiateInvestment } from '@/app/actions/accounts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { Loader2, TrendingUp } from 'lucide-react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Invest Now
    </Button>
  );
}

export function InvestmentForm({ accountId }: { accountId: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const investInAccount = initiateInvestment.bind(null, accountId);
  const [state, formAction] = useFormState(investInAccount, { message: '', success: false });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Investment Submitted!' : 'Uh oh!',
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full">
          <TrendingUp className="mr-2 h-4 w-4" />
          Invest
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form action={formAction}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Make Investment</h4>
              <p className="text-sm text-muted-foreground">
                Enter the amount you wish to invest.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="100"
                  min="100"
                  defaultValue="1000"
                  className="col-span-2 h-8"
                  required
                />
              </div>
            </div>
            <SubmitButton />
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
