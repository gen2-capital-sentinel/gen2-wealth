import type { InvestmentAccount } from '@/lib/types';
import { AccountCard } from './AccountCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type AccountListProps = {
  initialAccounts: InvestmentAccount[];
};

export function AccountList({ initialAccounts }: AccountListProps) {
  if (initialAccounts.length === 0) {
    return (
      <Card className="flex h-64 flex-col items-center justify-center text-center">
        <CardHeader>
          <CardTitle>No Accounts Yet</CardTitle>
          <CardDescription>
            Create your first investment account to get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {initialAccounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}
