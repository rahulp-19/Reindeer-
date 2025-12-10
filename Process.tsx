import React from 'react';
import { motion } from 'framer-motion';
import { PROCESS_STEPS } from '../constants';

const Process: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">How We Work</h1>
          <p className="text-gray-600">A transparent, step-by-step journey to your dream space.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-100 md:left-1/2 md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {PROCESS_STEPS.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Icon Node */}
                  <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-accent shadow-xl flex items-center justify-center z-10">
                    <step.icon className="text-primary" size={24} />
                  </div>

                  {/* Spacer for desktop alignment */}
                  <div className="hidden md:block w-1/2" />

                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                      <div className={`absolute top-0 w-1 h-full bg-primary ${isEven ? 'right-0' : 'left-0'}`}></div>
                      <span className="text-5xl font-bold text-gray-100 absolute -top-4 -right-4 z-0 group-hover:text-accent/10 transition-colors">
                        0{step.step}
                      </span>
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-secondary mb-2">{step.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Process;