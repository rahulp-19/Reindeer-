import React from 'react';
import { PRICING } from '../constants';
import TiltCard from '../components/TiltCard';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Pricing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary mb-4">Transparent Pricing</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Estimates based on super built-up area. Prices may vary based on material market rates in Jorhat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
          {PRICING.map((plan, index) => (
            <TiltCard key={index} className={plan.isRecommended ? 'z-10 md:-mt-8 md:mb-8' : ''}>
              <div 
                className={`bg-white rounded-3xl p-8 relative shadow-xl transition-all duration-300 border-2 ${
                  plan.isRecommended 
                    ? 'border-accent shadow-accent/20 scale-105' 
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                {plan.isRecommended && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Recommended
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-secondary mb-2">{plan.name}</h3>
                  <div className="text-3xl font-display font-bold text-primary mb-1">
                    {plan.priceRange}
                  </div>
                  <span className="text-gray-400 text-sm">Estimated Cost</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.isRecommended ? 'bg-accent/20 text-accent' : 'bg-gray-100 text-gray-500'}`}>
                        <Check size={12} />
                      </div>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => navigate('/contact')}
                  className={`w-full py-3 rounded-xl font-bold transition-colors ${
                    plan.isRecommended 
                      ? 'bg-gradient-to-r from-accent to-orange-500 text-white shadow-lg hover:shadow-xl' 
                      : 'bg-gray-100 text-secondary hover:bg-gray-200'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            </TiltCard>
          ))}
        </div>

        <div className="mt-20 text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-secondary mb-2">Need a Custom Quote?</h3>
          <p className="text-gray-500 mb-6">We understand every project is unique. Contact us for a tailored estimate based on your specific requirements.</p>
          <button 
             onClick={() => navigate('/contact')}
             className="text-primary font-bold hover:underline"
          >
            Contact Sales Team &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;