'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'For Individuals', href: '#client-types' },
    { name: 'Fees & Charges', href: '#about' },
  ];

  const businessLinks = [
      { name: 'Corporate Wealth', href: '#' },
      { name: 'Company Pension', href: '#' },
  ]

  const linkClassName = "text-sm font-medium text-foreground/80 transition-colors hover:text-primary";

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary/50 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden md:flex items-center gap-6">
           {navLinks.map((link) => (
             <Link key={link.name} href={link.href} className={linkClassName}>
                {link.name}
             </Link>
           ))}
           <DropdownMenu>
              <DropdownMenuTrigger className={cn(linkClassName, "flex items-center gap-1")}>
                For Businesses <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className='bg-background/80 backdrop-blur-md border-border'>
                {businessLinks.map((link) => (
                  <DropdownMenuItem key={link.name} asChild>
                    <Link href={link.href} className='text-black hover:text-white justify-center'>{link.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
           </DropdownMenu>
           <Link href="/gen2-capital" className={linkClassName}>
                For Advisors
           </Link>
        </nav>
        <div className="hidden md:flex items-center gap-4">
           <Button variant="ghost" asChild className={linkClassName}>
            <Link href="/signup">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href="/login">For Clients</Link>
          </Button>
        </div>
        <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={cn("hover:bg-accent", linkClassName)}>
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 p-6">
                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                        <Logo />
                    </Link>
                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">
                                {link.name}
                            </Link>
                        ))}
                         <p className='text-lg font-medium text-foreground/80'>For Businesses</p>
                         <div className='flex flex-col gap-2 pl-4'>
                            {businessLinks.map((link) => (
                                <Link key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <Link href="/gen2-capital" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">
                            For Advisors
                        </Link>

                    </nav>
                    <div className="mt-auto flex flex-col gap-4">
                         <Button variant="outline" asChild>
                            <Link href="/signup">Sign Up</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/login">For Clients</Link>
                        </Button>
                    </div>
                </div>
              </SheetContent>
            </Sheet>
        </div>
      </div>
    </header>
  );
}
