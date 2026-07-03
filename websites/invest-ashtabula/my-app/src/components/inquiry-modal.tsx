'use client';

import { ContactForm } from './contact-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useState } from 'react';

interface InquiryModalProps {
  siteId: string;
  siteName: string;
  trigger?: React.ReactNode;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function InquiryModal({ 
  siteId, 
  siteName, 
  trigger,
  variant = 'default',
  size = 'default',
  className
}: InquiryModalProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    // Close modal after a short delay to show success message
    setTimeout(() => {
      setOpen(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button 
            variant={variant} 
            size={size}
            className={className}
          >
            <Mail className="w-4 h-4 mr-2" />
            Inquire About This Site
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inquire About {siteName}</DialogTitle>
          <DialogDescription>
            Fill out the form below and our team will get back to you within 24 hours with more information about this property.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <ContactForm 
            siteId={siteId} 
            siteName={siteName}
            onSuccess={handleSuccess}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
