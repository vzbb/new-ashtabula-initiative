import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Permit Whisperer</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Making permitting simple for Ashtabula residents. 
              Find out exactly which permits you need and how to get them.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/wizard" className="text-muted-foreground hover:text-foreground">
                  Permit Wizard
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-muted-foreground hover:text-foreground">
                  Fee Calculator
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-muted-foreground hover:text-foreground">
                  Document Library
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://www.cityofashtabula.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  City of Ashtabula
                </a>
              </li>
              <li>
                <a 
                  href="https://www.citizenserve.com/ashtabula" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  County Portal
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Permit Whisperer. All rights reserved.</p>
          <p>
            Not an official government site. Information for guidance only.
          </p>
        </div>
      </div>
    </footer>
  );
}