
'use client';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function Contact() {
  const contactImage = PlaceHolderImages.find(img => img.id === 'contact-background');

  return (
    <section id="contact" className="relative py-16 md:py-24">
      {contactImage && (
        <Image
          src={contactImage.imageUrl}
          alt={contactImage.description}
          fill
          style={{ objectFit: 'cover' }}
          className="absolute inset-0 z-0"
          data-ai-hint={contactImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-background/80" />
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Have questions about our platform or services? We're here to help. Reach out and a member of our team will get back to you shortly.
            </p>
          </div>
          <div>
            <Card>
              <CardContent className="p-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your Name" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Your message..." rows={5} />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
