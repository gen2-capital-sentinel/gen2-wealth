
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function About() {
  const teamMembers = PlaceHolderImages.filter(img => img.id.startsWith('team-member'));

  return (
    <section id="about" className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">
            Pioneering Wealth Management with Intelligent Technology
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are a team of financial experts and technologists dedicated to democratizing wealth management. Our mission is to provide institutional-grade investment tools to everyone.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="text-center">
              <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full shadow-lg">
                <Image
                  src={member.imageUrl}
                  alt={member.description}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={member.imageHint}
                />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-foreground">{member.description.split(',')[0]}</h3>
              <p className="text-sm text-muted-foreground">{member.description.split(',').slice(1).join(',')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
