'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ContactForm } from '@/components/contact-form';
import { 
  Mail, 
  Phone, 
  Clock, 
  Building2
} from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-emerald-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg text-blue-100">
              Ready to explore opportunities in Ashtabula County? 
              Our team is here to help you find the perfect site and navigate available incentives.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we&apos;ll get back to you within 24 hours.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Ashtabula Area Development Corp</p>
                    <p className="text-sm text-muted-foreground">
                      1 N Chestnut Street, Suite 201<br />
                      Jefferson, OH 44047
                    </p>
                  </div>
                </div>

                <a 
                  href="tel:+14405762100"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">(440) 576-2100</p>
                  </div>
                </a>

                <a 
                  href="mailto:info@ashtacounty.org"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">info@ashtacounty.org</p>
                  </div>
                </a>

                <div className="flex items-start gap-3 p-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Office Hours</p>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday<br />
                      8:00 AM - 4:30 PM EST
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a 
                  href="/sites"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium">Browse Sites</span>
                  <Badge variant="outline">12 available</Badge>
                </a>
                <a 
                  href="/incentives"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <span className="font-medium">View Incentives</span>
                  <Badge variant="outline">8 programs</Badge>
                </a>
              </CardContent>
            </Card>

            {/* Schedule CTA */}
            <Card className="bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">Prefer to talk?</h3>
                <p className="text-blue-100 text-sm mb-4">
                  Schedule a call with our team at your convenience.
                </p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-blue-600 hover:bg-blue-50"
                  disabled
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
