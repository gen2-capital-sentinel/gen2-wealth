import type { InvestmentAccount } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Landmark, ShieldCheck } from 'lucide-react';
import { InvestmentForm } from './InvestmentForm';

type AccountCardProps = {
  account: InvestmentAccount;
};

export function AccountCard({ account }: AccountCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };
  
  const isISA = account.type === 'ISA';

  const getBadgeVariant = (status: InvestmentAccount['status']): BadgeProps['variant'] => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'closed':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isISA ? <ShieldCheck className="text-accent" /> : <Landmark className="text-accent" />}
              {account.type}
            </CardTitle>
            <CardDescription>Brokerage ID: {account.brokerageAccountId}</CardDescription>
          </div>
          <Badge variant={getBadgeVariant(account.status)} className="capitalize">
            {account.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-3xl font-bold tracking-tight">
            {formatCurrency(account.balance)}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <InvestmentForm accountId={account.id} />
      </CardFooter>
    </Card>
  );
}
