import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-lg mx-auto text-center">
          <CardContent className="p-8 md:p-12">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-blue-600" />
            </div>

            <h1 className="text-4xl font-bold mb-2">404</h1>
            <h2 className="text-xl font-semibold text-muted-foreground mb-4">Page Not Found</h2>

            <p className="text-muted-foreground mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for.
              It might have been moved or doesn&apos;t exist.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </Link>
              <Link href="/home">
                <Button>
                  <Home className="w-4 h-4 mr-2" />
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
