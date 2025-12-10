import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES } from '../constants';
import { ChevronDown, Check } from 'lucide-react';

const Services: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(SERVICES[0].id);

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive construction solutions tailored for the unique landscape and requirements of Assam.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-4 space-y-4">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveId(service.id)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 flex items-center justify-between group ${
                  activeId === service.id
                    ? 'bg-primary text-white shadow-lg shadow-primary/30 transform scale-105'
                    : 'bg-white text-secondary hover:bg-white/80 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <service.icon className={activeId === service.id ? 'text-accent' : 'text-gray-400 group-hover:text-primary'} />
                  <span className="font-bold text-lg">{service.title}</span>
                </div>
                {activeId === service.id && <ChevronDown className="transform -rotate-90" />}
              </button>
            ))}
          </div>

          {/* Detailed Content */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {SERVICES.map((service) => (
                service.id === activeId && (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                      <service.icon size={40} />
                    </div>
                    
                    <h2 className="text-3xl font-display font-bold text-secondary mb-6">{service.title}</h2>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {service.details.map((detail, index) => (
                        <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <Check size={14} className="text-green-600" />
                          </div>
                          <span className="font-medium text-gray-700">{detail}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 p-6 bg-primary/5 rounded-xl border border-primary/10">
                      <h4 className="font-bold text-primary mb-2">Why choose us for {service.title}?</h4>
                      <p className="text-sm text-gray-600">
                        We combine modern engineering with traditional wisdom suited for Assam's climate, ensuring longevity and comfort.
                      </p>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;