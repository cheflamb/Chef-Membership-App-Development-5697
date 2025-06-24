import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as FiIcons from 'react-icons/fi';

export const useOnboarding = () => {
  const { user } = useAuth();
  const [onboardingSteps, setOnboardingSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    if (user) {
      // Check if onboarding is complete
      const onboardingStatus = localStorage.getItem(`onboarding_${user.id}`);
      if (onboardingStatus) {
        const status = JSON.parse(onboardingStatus);
        setIsOnboardingComplete(status.completed);
        setOnboardingSteps(status.steps || []);
      } else {
        // Initialize onboarding steps based on user tier
        const steps = getOnboardingStepsForTier(user.tier);
        setOnboardingSteps(steps);
        setCurrentStep(steps.find(step => !step.completed));
      }
    }
  }, [user]);

  const getOnboardingStepsForTier = (tier) => {
    const baseSteps = [
      {
        id: 'welcome',
        title: 'Welcome to The Brigade',
        description: 'Get familiar with your new leadership community',
        type: 'welcome',
        completed: false,
        action: {
          type: 'complete',
          label: 'Get Started'
        }
      },
      {
        id: 'profile',
        title: 'Complete Your Profile',
        description: 'Tell us about your culinary background and leadership goals',
        type: 'profile',
        completed: false,
        action: {
          type: 'navigate',
          path: '/profile',
          label: 'Update Profile'
        }
      },
      {
        id: 'first-content',
        title: 'Explore Your First Content',
        description: 'Check out content recommended specifically for your experience level',
        type: 'content',
        completed: false,
        action: {
          type: 'navigate',
          path: '/courses',
          label: 'Browse Content'
        }
      }
    ];

    // Add tier-specific steps
    if (tier === 'fraternity' || tier === 'guild') {
      baseSteps.push({
        id: 'first-call',
        title: 'Join Your First Coaching Call',
        description: 'Schedule or join your first group coaching session',
        type: 'community',
        completed: false,
        action: {
          type: 'schedule',
          label: 'Schedule Call'
        }
      });
    }

    if (tier === 'guild') {
      baseSteps.push({
        id: 'strategy-call',
        title: 'Book Your Strategy Call',
        description: 'Schedule your private 1:1 onboarding call',
        type: 'community',
        completed: false,
        action: {
          type: 'schedule',
          label: 'Book Strategy Call'
        }
      });
    }

    baseSteps.push({
      id: 'community',
      title: 'Join the Community',
      description: 'Introduce yourself and connect with fellow culinary leaders',
      type: 'community',
      completed: false,
      action: {
        type: 'navigate',
        path: '/feed',
        label: 'Join Conversation'
      }
    });

    return baseSteps;
  };

  const getPersonalizedContent = (tier, experience = 'intermediate') => {
    const allContent = [
      {
        id: 1,
        title: 'Leadership Foundations for Chefs',
        description: 'Essential leadership principles every chef needs to know',
        duration: 25,
        difficulty: 'Beginner',
        category: 'Leadership',
        icon: FiIcons.FiTarget,
        color: 'bg-blue-500'
      },
      {
        id: 2,
        title: 'Building High-Performance Teams',
        description: 'Create teams that work together seamlessly under pressure',
        duration: 35,
        difficulty: 'Intermediate',
        category: 'Team Building',
        icon: FiIcons.FiUsers,
        color: 'bg-green-500'
      },
      {
        id: 3,
        title: 'Effective Kitchen Communication',
        description: 'Master the art of clear, motivating communication',
        duration: 20,
        difficulty: 'Beginner',
        category: 'Communication',
        icon: FiIcons.FiMessageCircle,
        color: 'bg-purple-500'
      },
      {
        id: 4,
        title: 'Managing Kitchen Conflicts',
        description: 'Turn conflicts into opportunities for team growth',
        duration: 40,
        difficulty: 'Advanced',
        category: 'Conflict Resolution',
        icon: FiIcons.FiShield,
        color: 'bg-red-500'
      },
      {
        id: 5,
        title: 'Financial Leadership for Chefs',
        description: 'Understanding P&L and making data-driven decisions',
        duration: 45,
        difficulty: 'Advanced',
        category: 'Business',
        icon: FiIcons.FiDollarSign,
        color: 'bg-orange-500'
      }
    ];

    // Filter content based on tier and experience
    let filteredContent = allContent;
    
    if (tier === 'brigade') {
      filteredContent = allContent.filter(content => 
        content.difficulty === 'Beginner' || content.difficulty === 'Intermediate'
      );
    }

    // Return top 3-4 recommendations
    return filteredContent.slice(0, tier === 'guild' ? 4 : 3);
  };

  const completeStep = async (stepId) => {
    const updatedSteps = onboardingSteps.map(step =>
      step.id === stepId ? { ...step, completed: true, completedAt: new Date().toISOString() } : step
    );
    
    setOnboardingSteps(updatedSteps);
    
    // Find next incomplete step
    const nextStep = updatedSteps.find(step => !step.completed);
    setCurrentStep(nextStep);

    // Save to localStorage
    const onboardingStatus = {
      steps: updatedSteps,
      completed: !nextStep,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(onboardingStatus));

    // If no next step, onboarding is complete
    if (!nextStep) {
      setIsOnboardingComplete(true);
    }
  };

  const markOnboardingComplete = async () => {
    const completedSteps = onboardingSteps.map(step => ({ ...step, completed: true }));
    setOnboardingSteps(completedSteps);
    setIsOnboardingComplete(true);
    setCurrentStep(null);

    const onboardingStatus = {
      steps: completedSteps,
      completed: true,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem(`onboarding_${user.id}`, JSON.stringify(onboardingStatus));
  };

  const resetOnboarding = () => {
    localStorage.removeItem(`onboarding_${user.id}`);
    const steps = getOnboardingStepsForTier(user.tier);
    setOnboardingSteps(steps);
    setCurrentStep(steps[0]);
    setIsOnboardingComplete(false);
  };

  return {
    onboardingSteps,
    currentStep,
    isOnboardingComplete,
    completeStep,
    markOnboardingComplete,
    resetOnboarding,
    getPersonalizedContent
  };
};