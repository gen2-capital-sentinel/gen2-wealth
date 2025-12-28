'use client';

import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const DISCLAIMER_SEEN_KEY = 'disclaimer_agreed';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // This code runs only on the client
    const hasAgreed = localStorage.getItem(DISCLAIMER_SEEN_KEY);
    if (!hasAgreed) {
      setIsOpen(true);
    }
  }, []);

  const handleAgree = () => {
    try {
      localStorage.setItem(DISCLAIMER_SEEN_KEY, 'true');
    } catch (error) {
      console.error('Could not save to localStorage', error);
    }
    setIsOpen(false);
  };
  
  const handleLeave = () => {
    // A simple way to "leave" is to redirect to a neutral site.
    // A blank page is less jarring than a full redirect.
    router.push('about:blank');
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Important Information for UK Residents</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4 pt-4">
            <p>
              The information on this website is intended exclusively for retail clients residing in the United Kingdom. It is not directed at, and must not be accessed by, persons who are residents of any other country.
            </p>
            <p>
              By proceeding, you confirm that you are a resident of the United Kingdom and are accessing this information for your own purposes.
            </p>
            <p className="font-semibold">
              Please be aware that the value of investments can go down as well as up, and you may get back less than you originally invested.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleLeave}>Leave Site</Button>
          <AlertDialogAction onClick={handleAgree}>I Agree</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
