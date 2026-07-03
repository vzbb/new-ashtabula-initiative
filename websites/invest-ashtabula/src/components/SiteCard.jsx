import React from 'react';
import { MapPin, Train, Anchor, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const SiteCard = ({ site }) => {
  const statusColors = {
    'Shovel-Ready': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Available': 'bg-blue-100 text-blue-800 border-blue-200',
    'Pre-Development': 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const statusColor = statusColors[site.status] || statusColors['Available'];

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-blue-600" />
          </div>
          <span className="text-sm text-gray-500">{site.acres} Acres</span>
        </div>

        {/* Status Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
          {site.status}
        </div>

        {/* Type Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200">
          {site.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {site.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {site.description}
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {site.features.slice(0, 3).map((feature, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-600 px-2.5 py-1 rounded-full border border-gray-100"
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              {feature}
            </span>
          ))}
        </div>

        {/* Transportation Icons */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
          {site.transportation.rail !== 'N/A' && (
            <div className="flex items-center gap-1" title="Rail Access">
              <Train className="w-4 h-4" />
              <span className="text-xs">Rail</span>
            </div>
          )}
          {site.transportation.port && (
            <div className="flex items-center gap-1" title="Port Access">
              <Anchor className="w-4 h-4" />
              <span className="text-xs">Port</span>
            </div>
          )}
          <div className="flex items-center gap-1" title="Utilities Ready">
            <Zap className="w-4 h-4" />
            <span className="text-xs">Utilities</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href={`#site/${site.id}`}
          className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default SiteCard;
