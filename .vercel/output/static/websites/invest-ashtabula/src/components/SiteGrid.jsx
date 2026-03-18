import React from 'react';
import SiteCard from './SiteCard';

const SiteGrid = ({ sites }) => {
  if (!sites || sites.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">No sites available at this time.</p>
      </div>
    );
  }

  return (
    <section id="sites" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Available Industrial Sites
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover prime development opportunities in Ashtabula County. 
            From shovel-ready industrial parks to flexible commercial space.
          </p>
        </div>

        {/* Site Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sites.map((site) => (
            <SiteCard key={site.id} site={site} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Looking for something specific? We have additional properties available.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Request Custom Site Search
          </a>
        </div>
      </div>
    </section>
  );
};

export default SiteGrid;
