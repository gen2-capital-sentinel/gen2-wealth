import { Badge, BadgeProps } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { KYCStatus as KYCStatusType } from '@/lib/types';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

type StatusConfig = {
  title: string;
  description: string;
  icon: React.ElementType;
  badgeVariant: BadgeProps['variant'];
  cardClass: string;
  iconClass: string;
};

const statusConfig: Record<KYCStatusType, StatusConfig> = {
  pending: {
    title: 'Pending Verification',
    description: "We're currently reviewing your information. This usually takes a few minutes.",
    icon: Clock,
    badgeVariant: 'warning',
    cardClass: 'bg-warning/10 border-warning/20',
    iconClass: 'text-warning',
  },
  approved: {
    title: 'Approved',
    description: 'Your identity has been successfully verified. You have full access to our platform.',
    icon: CheckCircle2,
    badgeVariant: 'success',
    cardClass: 'bg-success/10 border-success/20',
    iconClass: 'text-success',
  },
  rejected: {
    title: 'Verification Failed',
    description: 'We were unable to verify your identity. Please review your information and try again.',
    icon: AlertCircle,
    badgeVariant: 'destructive',
    cardClass: 'bg-destructive/10 border-destructive/20',
    iconClass: 'text-destructive',
  },
};

export function KYCStatus({ status }: { status: KYCStatusType }) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Card className={cn("h-full", config.cardClass)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <config.icon className={cn("h-8 w-8", config.iconClass)} />
          <span>KYC Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Badge variant={config.badgeVariant} className="mb-4 text-sm capitalize">{status}</Badge>
        <h3 className="font-semibold text-lg mb-1">{config.title}</h3>
        <CardDescription>{config.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
