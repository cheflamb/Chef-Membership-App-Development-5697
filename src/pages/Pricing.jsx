import React from 'react';
import {motion} from 'framer-motion';
import {useAuth} from '../context/AuthContext';
import PricingCard from '../components/PricingCard';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiCheck, FiShield, FiUsers, FiCrown, FiStar, FiHeart} = FiIcons;

const Pricing = () => {
  const {user, updateMembership} = useAuth();

  const plans = [
    {
      name: 'Brigade Membership',
      amount: 19,
      interval: 'month',
      description: 'For chefs who want better systems, more confidence, and a team that actually shows up.',
      icon: FiShield,
      color: 'blue',
      popular: true,
      paymentLink: 'https://buy.stripe.com/test_fZu28kcbS3HC6s03fgabK00',
      features: [
        'Chef Life Leadership Library (on-demand videos)',
        'Monthly Live Group Coaching Call',
        'Downloadable Tools (Food Cost Calculators, Culture Guides)',
        'Private Community Forum',
        'Monthly Quickfire Leadership Challenges',
        'Quarterly Guest Expert Workshops',
        'Founding Member Badge & Shoutout'
      ],
      limitations: []
    }
  ];

  const handleUpgrade = (planName) => {
    if (user) {
      updateMembership(planName.toLowerCase().replace('the ', ''));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8}}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            The Successful Chef™ Brigade Membership
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A scalable support system for chefs looking to lead with confidence, elevate kitchen culture, and build sustainable careers.
          </p>
          <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-orange-800 font-medium">
              <SafeIcon icon={FiHeart} className="inline h-5 w-5 mr-2" />
              <strong>Mission:</strong> Ongoing development, less isolation, stronger teams, and kitchens that thrive.
            </p>
          </div>
        </motion.div>

        {/* Free Tier Callout */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.2}}
          className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-8 mb-12 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Community Access</h3>
          <p className="text-gray-700 mb-4">
            Join our social feed for free - connect with other culinary professionals without the toxic memes.
          </p>
          <p className="text-sm text-gray-600">
            Perfect for chefs who want to connect with others in a supportive environment.
          </p>
        </motion.div>

        <div className="flex justify-center mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.6, delay: index * 0.1}}
              className="max-w-md"
            >
              <PricingCard
                plan={plan}
                currentTier={user?.tier}
                onUpgrade={handleUpgrade}
                isLoggedIn={!!user}
              />
            </motion.div>
          ))}
        </div>

        {/* Value Proposition */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.4}}
          className="bg-white rounded-2xl shadow-xl p-8 mb-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What Success Looks Like
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For You:</h3>
              <ul className="space-y-2">
                {[
                  'Increased leadership confidence and clarity',
                  'Better work-life balance and reduced burnout',
                  'Enhanced team performance and stability',
                  'Career advancement opportunities',
                  'Peer accountability and support network'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">For Your Business:</h3>
              <ul className="space-y-2">
                {[
                  'Higher team retention and internal promotions',
                  'Reduced management intervention needed',
                  'Improved team morale and fewer callouts',
                  'Smoother service and better guest experience',
                  'Lower food costs and waste reduction'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.6}}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                question: 'Do I need to be a Bootcamp graduate to join?',
                answer: 'Nope. Any chef ready to lead with intention is welcome. Bootcamp or Academy graduates may already have deeper context, but all committed leaders can benefit.'
              },
              {
                question: 'Can I cancel or change tiers anytime?',
                answer: 'Yes. Monthly memberships are flexible, and annual members may pause or upgrade tiers during renewal windows.'
              },
              {
                question: 'Can my company sponsor my membership?',
                answer: 'Absolutely. Enterprise sponsorships and custom onboarding are available for teams or properties.'
              },
              {
                question: 'What\'s the difference between tiers?',
                answer: 'Each tier builds on the last. Brigade gives structure and community, Fraternity adds depth and support, and Guild delivers strategic coaching and legacy-building.'
              },
              {
                question: 'Can I request a private group experience?',
                answer: 'YES. Private cohorts, leadership pods, or white-label community spaces are available on request.'
              },
              {
                question: 'Is there a money-back guarantee?',
                answer: 'We offer a 30-day satisfaction guarantee. If you\'re not seeing value in your first month, we\'ll refund your investment.'
              }
            ].map((faq, index) => (
              <div key={index} className="border-l-4 border-orange-600 pl-4">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.8}}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Lead with Confidence?</h3>
            <p className="text-orange-100 mb-6">
              Join The Successful Chef Brigade and get the leadership development you deserve.
            </p>
            {!user ? (
              <button
                onClick={() => window.open('https://buy.stripe.com/test_fZu28kcbS3HC6s03fgabK00', '_blank')}
                className="bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Your Leadership Journey
              </button>
            ) : (
              <p className="text-orange-100">Welcome to the Brigade! Upgrade your membership anytime.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;