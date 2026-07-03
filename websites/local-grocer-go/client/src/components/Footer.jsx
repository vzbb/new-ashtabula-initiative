import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Local Grocer Go</h3>
            <p className="text-gray-400 mb-4">
              Connecting Ashtabula County residents with fresh, local groceries. 
              Click, collect, and enjoy!
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4" />
              <span>Ashtabula County, Ohio</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Find a Store</Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-white transition-colors">Track Your Order</Link>
              </li>
              <li>
                <Link to="/store-dashboard" className="hover:text-white transition-colors">Store Login</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(440) 555-GROC</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>help@localgrocer.go</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p className="flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>for Ashtabula County</span>
          </p>
          <p className="mt-2 text-gray-500">
            © {new Date().getFullYear()} Local Grocer Go. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
