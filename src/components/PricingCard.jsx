import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useStripe } from '../hooks/useStripe'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCheck, FiX, FiStar } = FiIcons

const PricingCard = ({ plan }) => {
  const { user } = useAuth()
  const { createCheckoutSession, isLoading } = useStripe()

  const isCurrentPlan = user?.tier === plan.name.toLowerCase().replace('the ', '')
  
  // Stripe Price IDs (you'll need to create these in your Stripe dashboard)
  const priceIds = {
    'Brigade Membership': 'price_brigade_monthly', // Replace with actual Stripe price ID
    'Fraternity Membership': 'price_fraternity_monthly', // Replace with actual Stripe price ID  
    'Guild Membership': 'price_guild_monthly' // Replace with actual Stripe price ID
  }

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue':
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50', 
          text: 'text-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700',
          icon: 'bg-blue-600'
        }
      case 'purple':
        return {
          border: 'border-purple-200',
          bg: 'bg-purple-50',
          text: 'text-purple-600', 
          button: 'bg-purple-600 hover:bg-purple-700',
          icon: 'bg-purple-600'
        }
      case 'orange':
        return {
          border: 'border-orange-200',
          bg: 'bg-orange-50',
          text: 'text-orange-600',
          button: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
          icon: 'bg-gradient-to-r from-orange-600 to-red-600'
        }
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-gray-50',
          text: 'text-gray-600',
          button: 'bg-gray-600 hover:bg-gray-700',
          icon: 'bg-gray-600'
        }
    }
  }

  const colors = getColorClasses(plan.color)

  const handleUpgrade = async () => {
    if (!user) {
      // Redirect to sign up
      window.location.href = '/join'
      return
    }

    const priceId = priceIds[plan.name]
    if (!priceId) {
      console.error('No price ID found for plan:', plan.name)
      return
    }

    try {
      await createCheckoutSession(
        priceId,
        `${window.location.origin}/my-chefcoat?success=true`,
        `${window.location.origin}/pricing?canceled=true`
      )
    } catch (error) {
      console.error('Error starting checkout:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
        plan.popular 
          ? 'ring-2 ring-orange-500 shadow-xl' 
          : plan.exclusive 
          ? 'ring-2 ring-purple-500 shadow-xl' 
          : ''
      }`}
    >
      {plan.popular && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-600 to-red-600 text-white text-center py-2 text-sm font-medium">
          Most Popular
        </div>
      )}

      {plan.exclusive && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-medium">
          Limited to 12 Members
        </div>
      )}

      <div className={`p-8 ${plan.popular || plan.exclusive ? 'pt-16' : ''}`}>
        {/* Plan Header */}
        <div className="text-center mb-8">
          <div className={`${colors.icon} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
            <SafeIcon icon={plan.icon} className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">{plan.description}</p>
          
          {/* Pricing */}
          <div className="mb-4">
            <div className="flex items-baseline justify-center mb-2">
              <span className="text-4xl font-bold text-gray-900">${plan.amount}</span>
              <span className="text-gray-600 ml-2">/{plan.interval}</span>
            </div>
            {plan.yearlyPrice && (
              <div className="text-sm text-gray-500">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Save ${(plan.amount * 12) - plan.yearlyPrice}/year with annual billing
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <SafeIcon icon={FiCheck} className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
          {plan.limitations && plan.limitations.map((limitation, index) => (
            <div key={index} className="flex items-start space-x-3">
              <SafeIcon icon={FiX} className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-gray-500 text-sm">{limitation}</span>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center">
          {isCurrentPlan ? (
            <div className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-medium">
              Current Membership
            </div>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className={`w-full ${colors.button} text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Processing...' : user ? 'Upgrade Now' : 'Join Now'}
            </button>
          )}
        </div>

        {/* Special Notes */}
        {plan.name === 'Brigade Membership' && (
          <p className="text-center text-sm text-gray-500 mt-3">
            Cancel anytime
          </p>
        )}
        
        {plan.exclusive && (
          <p className="text-center text-sm text-orange-600 mt-3 font-medium">
            Exclusive: Only 12 seats available
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default PricingCard