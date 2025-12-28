
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Briefcase, Handshake } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const clientTypes = [
  {
    icon: <User className="h-10 w-10 text-primary" />,
    title: 'For Individuals',
    description: 'Take control of your financial future. Our AI-powered platform provides personalized investment strategies, automated portfolio management, and real-time insights to help you grow your wealth with confidence.',
    ctaText: 'Start Investing',
    ctaLink: '/signup',
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: 'For Businesses',
    description: 'Optimize your company\'s financial assets. We offer intelligent treasury management, corporate investment accounts, and customized financial planning to help your business thrive in a dynamic market.',
    ctaText: 'Corporate Solutions',
    ctaLink: '/gen2-capital',
  },
  {
    icon: <Handshake className="h-10 w-10 text-primary" />,
    title: 'For Advisors',
    description: 'Empower your practice with next-generation tools. Leverage our AI analytics, streamlined client management, and comprehensive reporting to deliver superior value to your clients.',
    ctaText: 'Partner With Us',
    ctaLink: '/gen2-capital',
  },
];

export function ClientCarousel() {
  const backgroundImage = PlaceHolderImages.find(img => img.id === 'carousel-background');

  return (
    <section id="how-it-works" className="relative py-16 md:py-24 bg-background overflow-hidden">
        {backgroundImage && (
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                    backgroundImage: `url('${backgroundImage.imageUrl}')`,
                }}
                data-ai-hint={backgroundImage.imageHint}
            ></div>
        )}
        <div className="absolute inset-0 bg-white/50"></div>
        <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground font-bold">
                Getting started on your journey to financial freedom is simple.
              </p>
            </div>
            <Carousel
              opts={{
                align: 'start',
              }}
              className="w-full"
            >
              <CarouselContent>
                {clientTypes.map((client, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Card className="flex flex-col h-full text-center">
                        <CardHeader className="items-center">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-secondary shadow-md">
                                {client.icon}
                            </div>
                          <CardTitle>{client.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between">
                          <CardDescription className="mb-6">{client.description}</CardDescription>
                          <Button asChild>
                            <Link href={client.ctaLink}>{client.ctaText}</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
        </div>
    </section>
  );
}
