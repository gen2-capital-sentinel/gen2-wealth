import { LandingHeader } from './components/LandingHeader';
import { LandingFooter } from './components/LandingFooter';
import { DisclaimerModal } from './components/DisclaimerModal';
import { ClientCarousel } from './components/ClientCarousel';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Features } from './components/Features';
import { Contact } from './components/Contact';

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <Hero />
        <About />
        <ClientCarousel />
        <div className="py-8 bg-gray-800" />
        <Features />
        <Contact />
      </main>
      <LandingFooter />
      <DisclaimerModal />
    </>
  );
}
