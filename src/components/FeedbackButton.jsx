import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackWorkflow } from '@questlabs/react-sdk';
import { useAuth } from '../context/AuthContext';
import questConfig from '../questConfig';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMessageCircle, FiChevronLeft, FiChevronRight } = FiIcons;

const FeedbackButton = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show feedback button if user is not logged in
  if (!user) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating Feedback Button */}
      <motion.button
        onClick={handleToggle}
        className="fixed top-1/2 -right-10 transform -translate-y-1/2 rotate-[270deg] bg-primary hover:bg-red-800 text-white px-4 py-2 rounded-t-md rounded-b-none shadow-lg transition-all duration-300 z-50 flex items-center space-x-2"
        whileHover={{ right: -8 }}
        initial={{ right: -40 }}
        animate={{ right: -40 }}
      >
        <div className="w-fit h-fit rotate-90 transition-all duration-300">
          <SafeIcon 
            icon={isOpen ? FiChevronLeft : FiChevronRight} 
            className="h-4 w-4" 
          />
        </div>
        <span className="text-white text-sm font-medium leading-none font-lato">
          Feedback
        </span>
      </motion.button>

      {/* Feedback Workflow Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              <FeedbackWorkflow
                uniqueUserId={localStorage.getItem('quest_userId') || user.id || questConfig.USER_ID}
                questId={questConfig.QUEST_FEEDBACK_QUESTID}
                isOpen={isOpen}
                accent={questConfig.PRIMARY_COLOR}
                onClose={handleClose}
              >
                <FeedbackWorkflow.Header />
                <FeedbackWorkflow.Content />
                <FeedbackWorkflow.ThankYou />
                <FeedbackWorkflow.Footer />
              </FeedbackWorkflow>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackButton;