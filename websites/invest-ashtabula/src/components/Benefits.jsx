import React from 'react';
import { MapPin, Users, TrendingUp, Shield, Clock, Truck } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: MapPin,
      title: 'Strategic Location',
      description: 'Direct access to I-90, CSX rail, and the Port of Ashtabula on Lake Erie. Within 500 miles of major Midwest markets.',
    },
    {
      icon: Users,
      title: 'Skilled Workforce',
      description: 'Access to 200,000+ workers within 30-minute drive. Strong manufacturing heritage and training programs.',
    },
    {
      icon: TrendingUp,
      title: 'Financial Incentives',
      description: 'Opportunity Zone, TIF districts, tax abatements, and JobsOhio support for qualifying projects.',
    },
    {
      icon: Shield,
      title: 'Business-Friendly',
      description: 'Streamlined permitting, dedicated economic development team, and proactive local government support.',
    },
    {
      icon: Clock,
      title: 'Fast Time-to-Market',
      description: 'Shovel-ready sites with utilities in place. Move from concept to operation faster than major metros.',
    },
    {
      icon: Truck,
      title: 'Multi-Modal Logistics',
      description: 'Highway, rail, port, and air cargo within reach. Ideal for distribution and manufacturing operations.',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Why Invest in Ashtabula?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Located on the shores of Lake Erie, Ashtabula County offers 
            unbeatable access, incentives, and support for your business.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <benefit.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
