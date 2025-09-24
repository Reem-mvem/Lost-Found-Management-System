import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, MessageSquare, Shield, Zap, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Buttons and Text */}
            <div className="order-2 lg:order-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Find it smart,
                <span className="block text-yellow-400">
                  by using our AI tool
                </span>
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-10">
                Revolutionary AI technology that connects lost items with their owners through intelligent matching, 
                making recovery faster and more secure than ever before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 max-w-lg">
                <Link
                  to="/venue-auth"
                  className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Building2 className="h-5 w-5" />
                  <span>I'm a Venue</span>
                </Link>
                <Link
                  to="/claim"
                  className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Search className="h-5 w-5" />
                  <span>I Lost Something</span>
                </Link>
              </div>
            </div>

            {/* Right Side - Logo and Wajad Text */}
            <div className="order-1 lg:order-2 flex flex-col items-center justify-center">
              <div className="mb-6">
                <img 
                  src="/logo.svg" 
                  alt="Wajad Logo" 
                  style={{ backgroundColor: 'transparent' }}
                  className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-2xl shadow-2xl"
                />
              </div>
              <h2 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">
                Wajad
              </h2>
              <p className="text-lg text-blue-100 text-center">
                Find it smart, by using our AI tool
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* How Our Technology Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Our Technology Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI system uses advanced natural language processing and computer vision 
              to create secure, accurate matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-black rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Upload</h3>
              <p className="text-gray-600">
                Venues securely upload item details and photos to our encrypted database.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-black rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes and indexes items using advanced computer vision and ML.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-black rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                User descriptions are matched against items using intelligent algorithms.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-black rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safe Reunion</h3>
              <p className="text-gray-600">
                Verified matches connect owners with venues through secure channels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of venues and users already using Wajad to reunite people with their belongings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/venue-auth"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Register Your Venue
            </Link>
            <Link
              to="/claim"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Find Your Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;