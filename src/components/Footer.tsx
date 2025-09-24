import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <Search className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">Lost & Found AI</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Revolutionizing lost item recovery with AI-powered matching technology. 
              Connecting venues and individuals to reunite people with their belongings.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center text-gray-300">
                
                
              </div>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;