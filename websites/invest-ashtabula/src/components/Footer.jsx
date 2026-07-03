import React from 'react';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-4">
              Invest in<span className="text-amber-400">Ashtabula</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-md">
              Your gateway to prime industrial real estate in Northeast Ohio. 
              We connect investors and developers with opportunities in 
              Ashtabula County.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>Ashtabula County, Ohio</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#sites" className="text-gray-400 hover:text-white transition-colors">Available Sites</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Incentives</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Workforce Data</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Success Stories</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Contact AADC</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:invest@ashtabula.org"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  invest@ashtabula.org
                </a>
              </li>
              <li>
                <a
                  href="tel:+4409921438"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (440) 992-1438
                </a>
              </li>
              <li>
                <a
                  href="https://www.ashtabula.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  ashtabula.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Ashtabula Area Development Corporation. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            A project of the{' '}
            <a
              href="https://www.ashtabula.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300"
            >
              New Ashtabula Initiative
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
