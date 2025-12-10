import React from 'react';
import { motion } from 'framer-motion';
import { TEAM } from '../constants';
import TiltCard from '../components/TiltCard';

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Intro */}
        <section className="mb-24 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-6">Our Story</h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Founded in Jorhat, <strong>Reindeer Construction</strong> started with a simple mission: to bring professional, safe, and transparent construction services to upper Assam. We understand the local soil, the weather, and the dreams of our people. From a small renovation team, we have grown into a full-service construction company trusted by hundreds of families.
          </p>
        </section>

        {/* Mission & Values */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { title: 'Safety First', desc: 'We strictly adhere to safety protocols, ensuring secure sites and structurally sound buildings.' },
            { title: 'Transparency', desc: 'No hidden costs. We provide detailed estimates and regular updates so you know exactly where your money goes.' },
            { title: 'Timeliness', desc: 'We respect your time. Our project management ensures we deliver keys on the promised date.' }
          ].map((value, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-accent/30 transition-colors">
              <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
              <p className="text-gray-600">{value.desc}</p>
            </div>
          ))}
        </section>

        {/* Timeline */}
        <section className="mb-24">
          <h2 className="text-3xl font-display font-bold text-center mb-16">Our Journey</h2>
          <div className="relative">
            {/* Horizontal Line (Desktop) / Vertical (Mobile) handled via CSS Grid/Flex */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { year: '2012', title: 'Inception', desc: 'Started as a small renovation contractor in Tarajan.' },
                { year: '2015', title: 'First Complex', desc: 'Completed our first G+2 commercial building.' },
                { year: '2019', title: 'Expansion', desc: 'Expanded team to include architects and civil engineers.' },
                { year: '2023', title: 'Awarded', desc: 'Recognized as Top Residential Builder in Jorhat.' }
              ].map((milestone, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-6 h-6 bg-accent rounded-full border-4 border-white shadow-lg mb-6 z-10 md:mb-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:group-hover:scale-150 transition-transform"></div>
                  
                  {/* Alternating content position for visual interest on desktop could be complex, keeping it simple top/bottom for now or stacked */}
                  <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 w-full md:mt-12 group-hover:-translate-y-2 transition-transform duration-300`}>
                    <span className="text-accent font-bold text-xl block mb-1">{milestone.year}</span>
                    <h4 className="font-bold text-secondary mb-2">{milestone.title}</h4>
                    <p className="text-sm text-gray-500">{milestone.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section>
          <h2 className="text-3xl font-display font-bold text-center mb-12">Meet The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center">
            {TEAM.map((member, i) => (
              <TiltCard key={i}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg group">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-secondary">{member.name}</h3>
                    <p className="text-accent font-medium">{member.role}</p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;