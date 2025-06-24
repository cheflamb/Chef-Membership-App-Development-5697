import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiArrowRight, FiHeart, FiTarget, FiTrendingUp, FiExternalLink } = FiIcons;

const Home = () => {
  const { user } = useAuth();

  const currentPrompt = "What's one leadership moment from today that you're proud of?";

  const nextLiveEvent = {
    title: "Monthly Leadership Deep Dive: Handling Difficult Conversations",
    date: "January 28, 2024",
    time: "3:00 PM EST",
    tier: "Fraternity & Guild"
  };

  const handleRSSFeedClick = () => {
    window.open('https://feeds.captivate.fm/therealchefliferadio/', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <img 
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727120961-Brigade2.png" 
                  alt="The Successful Chef Brigade Logo" 
                  className="h-16 w-16 object-contain mx-auto"
                />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-montserrat font-bold text-charcoal mb-6">
              The Successful Chef{' '}
              <span className="text-primary">Brigade</span>
            </h1>
            
            <p className="text-xl font-lato text-charcoal mb-4 max-w-3xl mx-auto">
              <strong>Transform kitchen culture through emotionally intelligent, human-centered leadership.</strong>
            </p>
            
            <p className="text-lg font-lato text-gray-600 mb-8 max-w-2xl mx-auto">
              No recipes. No cooking tips. Just real leadership training designed specifically for chefs who want to build better teams and create sustainable careers.
            </p>

            {!user && (
              <Link
                to="/join"
                className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-lg text-lg font-lato font-medium hover:bg-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Join Free & Start Kitchen Leadership 101</span>
                <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Chef's Table Preview - Moved to directly below hero */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold text-charcoal mb-4">
                Chef's Table
              </h2>
              <p className="text-lg font-lato text-gray-600 max-w-2xl mx-auto">
                Connect with fellow culinary leaders in a supportive community. No toxic memes, just real conversations about leadership challenges and wins.
              </p>
            </div>

            <div className="relative">
              {/* Blurred preview for non-users */}
              {!user && (
                <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <SafeIcon icon={FiUsers} className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-montserrat font-bold text-charcoal mb-2">
                      Join the Conversation
                    </h3>
                    <p className="font-lato text-gray-600 mb-6">
                      Get full access to our leadership community
                    </p>
                    <Link
                      to="/join"
                      className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                    >
                      <span>Join Free</span>
                      <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Sample posts */}
              <div className="space-y-6">
                <div className="bg-background rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                      alt="Chef Marcus" 
                      className="h-12 w-12 rounded-full" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-lato font-medium text-charcoal">Chef Marcus</span>
                        <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-montserrat font-bold">BRIGADE</span>
                      </div>
                      <p className="font-lato text-charcoal leading-relaxed">
                        Had a breakthrough with my sous chef today. Instead of micromanaging, I asked "What support do you need to succeed?" The shift in their body language was immediate. Sometimes the best leadership is just asking the right questions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-2xl p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108755-2616b9a9b2f1?w=150&h=150&fit=crop&crop=face" 
                      alt="Chef Sarah" 
                      className="h-12 w-12 rounded-full" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-lato font-medium text-charcoal">Chef Sarah</span>
                        <span className="bg-gold text-charcoal px-2 py-1 rounded-full text-xs font-montserrat font-bold">GUILD</span>
                      </div>
                      <p className="font-lato text-charcoal leading-relaxed">
                        Implemented the "dignity not domination" principle during tonight's dinner rush. Even when we were slammed, I made sure every correction came with respect. The energy in the kitchen stayed positive, and service flowed better than ever.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/chefs-table"
                className="inline-flex items-center space-x-2 text-primary font-lato font-medium hover:text-red-800 transition-colors"
              >
                <span>View Full Chef's Table</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
              </Link>
              
              <span className="text-gray-400 hidden sm:block">•</span>
              
              <button
                onClick={handleRSSFeedClick}
                className="inline-flex items-center space-x-3 bg-charcoal text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl"
              >
                <img 
                  src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750727843097-1.png" 
                  alt="Chef Life Radio Logo" 
                  className="h-5 w-5 object-contain"
                />
                <span>Listen to Chef Life Radio</span>
                <SafeIcon icon={FiExternalLink} className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Current Prompt Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-8 border border-gray-200"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-montserrat font-bold text-charcoal mb-2">Today's Leadership Prompt</h2>
              <p className="font-lato text-gray-600">Take a moment to reflect on your leadership journey</p>
            </div>
            
            <div className="bg-background rounded-xl p-6 border-l-4 border-primary">
              <p className="text-lg font-playfair italic text-charcoal text-center">
                "{currentPrompt}"
              </p>
            </div>
            
            <div className="text-center mt-6">
              {user ? (
                <Link
                  to="/journal"
                  className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                >
                  <SafeIcon icon={FiHeart} className="h-4 w-4" />
                  <span>Open My Journal</span>
                </Link>
              ) : (
                <Link
                  to="/join"
                  className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors"
                >
                  <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
                  <span>Join to Start Journaling</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Event Highlight */}
      <section className="py-16 bg-gradient-to-r from-primary to-red-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h2 className="text-3xl font-montserrat font-bold text-white mb-4">
              Next Live Event
            </h2>
            
            <div className="bg-white bg-opacity-10 rounded-2xl p-8 backdrop-blur-sm">
              <h3 className="text-xl font-lato font-bold text-white mb-4">
                {nextLiveEvent.title}
              </h3>
              
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-white mb-6">
                <span className="font-lato">{nextLiveEvent.date}</span>
                <span className="font-lato">{nextLiveEvent.time}</span>
                <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-sm font-montserrat font-bold">
                  {nextLiveEvent.tier}
                </span>
              </div>
              
              <Link
                to="/live-events"
                className="inline-flex items-center space-x-2 bg-white text-primary px-6 py-3 rounded-lg font-lato font-medium hover:bg-gray-100 transition-colors"
              >
                <span>View All Live Events</span>
                <SafeIcon icon={FiArrowRight} className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-charcoal">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-montserrat font-bold text-white mb-4">
                Our Core Values
              </h2>
              <p className="text-lg font-lato text-gray-300">
                The principles that guide every leader in The Brigade
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { title: 'Presence Over Position', icon: FiTarget },
                { title: '1% Better Than Yesterday', icon: FiTrendingUp },
                { title: 'Dignity, Not Domination', icon: FiHeart },
                { title: 'Lead From the Heart', icon: FiUsers },
                { title: 'Community Over Ego', icon: FiUsers }
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary p-4 rounded-xl mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                    <SafeIcon icon={value.icon} className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-montserrat font-bold text-white text-sm leading-tight">
                    {value.title}
                  </h3>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-primary">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <h2 className="text-3xl font-montserrat font-bold text-white mb-4">
                Ready to Transform Your Leadership?
              </h2>
              <p className="text-xl font-lato text-red-100 mb-8">
                Join thousands of chefs building better teams and creating sustainable careers.
              </p>
              <Link
                to="/join"
                className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg text-lg font-lato font-medium hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Start Your Leadership Journey</span>
                <SafeIcon icon={FiArrowRight} className="h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;