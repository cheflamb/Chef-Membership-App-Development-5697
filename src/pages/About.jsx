import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiHeart, FiTarget, FiTrendingUp, FiUsers, FiShield } = FiIcons;

const About = () => {
  const coreValues = [
    {
      title: 'Presence Over Position',
      description: 'True leadership comes from being fully present with your team, not from your title or position in the hierarchy.',
      icon: FiTarget
    },
    {
      title: '1% Better Than Yesterday',
      description: 'Small, consistent improvements in leadership create massive transformation over time.',
      icon: FiTrendingUp
    },
    {
      title: 'Dignity, Not Domination',
      description: 'Great leaders build people up through respect and dignity, never through intimidation or domination.',
      icon: FiShield
    },
    {
      title: 'Lead From the Heart',
      description: 'Authentic leadership flows from emotional intelligence, empathy, and genuine care for others.',
      icon: FiHeart
    },
    {
      title: 'Community Over Ego',
      description: 'The strongest leaders put the team and community first, setting aside personal ego for collective success.',
      icon: FiUsers
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-montserrat font-bold text-charcoal mb-6">
              About The Successful Chef Brigade
            </h1>
            
            {/* Vision Statement */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-8">
              <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-4">Our Vision</h2>
              <p className="text-xl font-playfair italic text-primary leading-relaxed">
                "To transform kitchen culture through emotionally intelligent, human-centered leadership."
              </p>
            </div>

            <p className="text-lg font-lato text-gray-600 max-w-3xl mx-auto leading-relaxed">
              The Successful Chef Brigade is more than a training program—it's a movement to revolutionize how culinary professionals lead, connect, and thrive. We believe that great food starts with great leadership, and great leadership starts with developing yourself.
            </p>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-montserrat font-bold text-charcoal text-center mb-12">
              Our Core Values
            </h2>
            
            <div className="space-y-8">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-gray-200"
                >
                  <div className="flex items-start space-x-6">
                    <div className="bg-primary p-4 rounded-xl flex-shrink-0">
                      <SafeIcon icon={value.icon} className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-montserrat font-bold text-charcoal mb-3">
                        {value.title}
                      </h3>
                      <p className="font-lato text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* What We're Not */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 mb-16">
            <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-6 text-center">
              What We're NOT
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-montserrat font-bold text-primary mb-2">We Don't Teach:</h3>
                <ul className="space-y-2 font-lato text-gray-600">
                  <li>• Cooking techniques or recipes</li>
                  <li>• Food trends or menu development</li>
                  <li>• Kitchen equipment or technology</li>
                  <li>• Culinary skills or food safety</li>
                </ul>
              </div>
              <div>
                <h3 className="font-montserrat font-bold text-primary mb-2">We DO Focus On:</h3>
                <ul className="space-y-2 font-lato text-gray-600">
                  <li>• Leadership development and emotional intelligence</li>
                  <li>• Team building and communication skills</li>
                  <li>• Personal growth and self-reflection</li>
                  <li>• Creating positive kitchen culture</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Legal Disclaimers */}
          <div className="bg-background rounded-2xl p-8 border border-gray-200 mb-16">
            <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-6 text-center">
              Important Disclaimers
            </h2>
            <div className="space-y-6 font-lato text-gray-600">
              <div>
                <h3 className="font-montserrat font-bold text-charcoal mb-2">Coaching Disclaimer</h3>
                <p>
                  The Successful Chef Brigade provides leadership coaching and professional development. 
                  This is not therapy, counseling, or medical advice. We focus on professional growth, 
                  leadership skills, and workplace effectiveness.
                </p>
              </div>
              
              <div>
                <h3 className="font-montserrat font-bold text-charcoal mb-2">Hold Harmless Agreement</h3>
                <p>
                  By participating in The Successful Chef Brigade, you acknowledge that you are solely 
                  responsible for your decisions and actions. We are not liable for any outcomes 
                  resulting from the application of concepts, strategies, or advice shared in our programs.
                </p>
              </div>
              
              <div>
                <h3 className="font-montserrat font-bold text-charcoal mb-2">Media Release</h3>
                <p>
                  By joining our community, you consent to the potential use of your likeness, voice, 
                  testimonials, and content in our marketing materials, social media, and promotional 
                  content. We respect your privacy and will never share personal information without consent.
                </p>
              </div>
            </div>
          </div>

          {/* Chef Adam's Signature */}
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <p className="text-lg font-montserrat font-bold text-charcoal mb-4">
                Stay Tall & Frosty. And Lead from the Heart.
              </p>
              
              {/* Signature Image Placeholder */}
              <div className="flex justify-center mb-4">
                <div className="w-48 h-24 bg-background border border-gray-200 rounded-lg flex items-center justify-center">
                  <span className="font-playfair italic text-charcoal text-sm">Chef Adam's Signature</span>
                </div>
              </div>
              
              <p className="font-lato text-gray-600">
                Chef Adam, Founder<br />
                The Successful Chef Brigade
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;