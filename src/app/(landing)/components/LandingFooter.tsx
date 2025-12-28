import { Logo } from '@/components/Logo';
import Link from 'next/link';

export function LandingFooter() {
  const footerLinks = {
    platform: [
      { name: 'Features', href: '#features' },
      { name: 'How It Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#' },
      { name: 'Security', href: '#' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Contact', href: '#contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  };

  return (
    <footer className="bg-secondary/50 text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              The future of wealth is intelligent.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-9 md:grid-cols-3">
            <div>
              <h3 className="font-semibold text-foreground/90">Platform</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.platform.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">Company</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.company.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90">Legal</h3>
              <ul className="mt-4 space-y-2">
                {footerLinks.legal.map(link => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-xs text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <div className="text-left text-xs text-muted-foreground space-y-2">
            <p>
              Gen2Wealth® Management, a trading name of Premier Independent Investments UK Limited (PIIUK), is part of the Strategic Value Group. Registered in England and Wales (No. 03339739) with registered offices at C23G, The Print Rooms, Holly Farm Business Park, Honiley, Kenilworth, Warwickshire, CV8 1NP.
            </p>
            <p>
              We are fully authorised and regulated by the Financial Conduct Authority (FCA) (FRN: 186697).
            </p>
            <p>
              The content on this site is for informational purposes only and does not constitute financial, mortgage, or legal advice, nor an offer to invest. Investment values can rise and fall, and your capital is at risk. We strongly recommend seeking professional advice before making financial decisions.
            </p>
            <p>
              While we take care to maintain security, Gen2Wealth® cannot guarantee the integrity of communications and cannot accept liability for viruses or other technical issues.
            </p>
            <p className="pt-4">
                &copy; {new Date().getFullYear()} Gen2 Wealth. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
