
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center text-center text-white">
      <div className="absolute inset-0">
        {heroImage && (
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            style={{ objectFit: 'cover' }}
            priority
            data-ai-hint={heroImage.imageHint}
            className="filter brightness-110 blur-sm"
            />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          The Future of <span className="text-primary">Wealth</span> is Intelligent
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-300">
          Harness the power of AI to build and manage your wealth.
          Gen2 provides institutional-grade tools for the modern investor.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="link" size="lg" className="text-white">
            <Link href="#features">Learn more &rarr;</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
