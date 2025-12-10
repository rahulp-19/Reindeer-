import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import TiltCard from '../components/TiltCard';
import { SERVICES } from '../constants';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
            alt="Assam Style House" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-secondary/80 mix-blend-multiply"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-8 pt-20 text-white">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-accent font-semibold tracking-wider uppercase mb-4 text-sm md:text-base">
                Construction in Jorhat
              </h2>
              <h1 className="font-display font-bold text-5xl md:text-7xl leading-tight mb-6">
                We Build Your Houses, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  Shops & Dreams
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-xl leading-relaxed">
                Turnkey construction for homes, shops, and small commercial spaces. 
                Strong foundations for a safe future in Assam.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 bg-accent text-white rounded-full font-bold text-lg hover:bg-amber-600 transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center gap-2 group"
                >
                  Get a Free Estimate
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/projects')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  View Our Projects
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Abstract Element */}
        <motion.div 
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl z-0"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative z-20 -mt-10 rounded-t-3xl shadow-2xl mx-2 md:mx-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {[
              { label: 'Years Experience', value: '12+' },
              { label: 'Projects Done', value: '150+' },
              { label: 'Happy Clients', value: '140+' },
              { label: 'Team Members', value: '25+' },
            ].map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="text-4xl md:text-5xl font-bold text-primary mb-2 font-display">{stat.value}</h3>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <span className="text-accent font-semibold tracking-wider uppercase">What We Do</span>
            <h2 className="text-4xl font-bold text-secondary mt-2 font-display">Our Core Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <TiltCard key={service.id} className="h-full">
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow h-full flex flex-col items-center text-center border-b-4 border-accent">
                  <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mb-6 text-primary">
                    <service.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>
                  <button 
                    onClick={() => navigate('/services')}
                    className="text-accent font-semibold text-sm hover:underline"
                  >
                    Learn More &rarr;
                  </button>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-secondary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
               <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Construction Worker" 
                className="rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white/10"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                Why Jorhat Trusts <br />
                <span className="text-accent">Reindeer Construction</span>
              </h2>
              <div className="space-y-6">
                {[
                  "Transparency in Pricing & Materials",
                  "On-Time Delivery Guarantee",
                  "Earthquake Resistant Designs (Assam Context)",
                  "Experienced Local Workforce"
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <CheckCircle2 className="text-accent shrink-0" />
                    <span className="font-medium text-lg">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;