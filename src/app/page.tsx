'use client';
import { LandingHeader } from './(landing)/components/LandingHeader';
import { LandingFooter } from './(landing)/components/LandingFooter';
import { DisclaimerModal } from './(landing)/components/DisclaimerModal';
import { ClientCarousel } from './(landing)/components/ClientCarousel';
import { Hero } from './(landing)/components/Hero';
import { About } from './(landing)/components/About';
import { Features } from './(landing)/components/Features';

export default function HomePage() {
  return (
    <>
      <LandingHeader />
      <main>
        <Hero />
        <About />
        <Features />
        <ClientCarousel />
      </main>
      <LandingFooter />
      <DisclaimerModal />
    </>
  );
}
