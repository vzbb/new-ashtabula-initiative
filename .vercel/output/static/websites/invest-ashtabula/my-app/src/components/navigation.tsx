'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { MapPin, Menu, Building2, LayoutDashboard } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/sites', label: 'Sites' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/incentives', label: 'Incentives' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-foreground">Invest</span>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Ashtabula</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
                {item.href === '/dashboard' && (
                  <Badge variant="secondary" className="ml-2 text-[10px] px-1 py-0">New</Badge>
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/sites" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-2">
                <Building2 className="w-4 h-4" />
                Find Sites
              </Button>
            </Link>
            
            <Link href="/contact" className="hidden sm:block">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                Get in Touch
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <Link 
                      href="/" 
                      className="flex items-center gap-2" 
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-600 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">InvestAshtabula</span>
                    </Link>
                  </div>

                  {/* Mobile Nav Items */}
                  <nav className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 space-y-1">
                      {navItems.map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-foreground hover:bg-muted'
                          }`}
                        >
                          <span>{item.label}</span>
                          {item.href === '/dashboard' && (
                            <Badge variant="secondary" className="text-[10px]">New</Badge>
                          )}
                          {isActive(item.href) && (
                            <div className="w-2 h-2 rounded-full bg-blue-600" />
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Quick Stats in Mobile Menu */}
                    <div className="mt-6 px-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-4">
                        Quick Links
                      </p>
                      <div className="space-y-1">
                        <Link
                          href="/sites"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Browse Sites</p>
                            <p className="text-xs text-muted-foreground">View available properties</p>
                          </div>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-xs text-muted-foreground">Site availability metrics</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </nav>

                  {/* Mobile Footer Actions */}
                  <div className="p-4 border-t space-y-3">
                    <Link href="/contact" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700">
                        Get in Touch
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                      Ashtabula Area Development Corp
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
