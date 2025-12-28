'use client';

import { useEffect, useState } from 'react';
import { CreateAccountForm } from './CreateAccountForm';

type DashboardHeaderProps = {
  name: string;
};

export function DashboardHeader({ name }: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {greeting ? `${greeting}, ${name}` : `Welcome, ${name}`}
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your investment accounts.
        </p>
      </div>
      <CreateAccountForm />
    </div>
  );
}
