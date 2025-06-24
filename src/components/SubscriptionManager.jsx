import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useStripe } from '../hooks/useStripe'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiCreditCard, FiSettings, FiDownload, FiCalendar, FiAlertCircle } = FiIcons

const SubscriptionManager = () => {
  const { user } = useAuth()
  const { createBillingPortalSession, isLoading } = useStripe()
  const [error, setError] = useState('')

  const handleManageSubscription = async () => {
    try {
      setError('')
      await createBillingPortalSession()
    } catch (err) {
      setError(err.message)
    }
  }

  const getTierDetails = (tier) => {
    switch (tier) {
      case 'brigade':
        return {
          name: 'Brigade Member',
          price: '$19/month',
          color: 'text-red-600 bg-red-50 border-red-200'
        }
      case 'fraternity':
        return {
          name: 'Fraternity Member', 
          price: '$97/month',
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
        }
      case 'guild':
        return {
          name: 'Guild Member',
          price: '$497/month', 
          color: 'text-purple-600 bg-purple-50 border-purple-200'
        }
      default:
        return {
          name: 'Free Member',
          price: 'Free',
          color: 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }
  }

  const tierDetails = getTierDetails(user?.tier)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
    >
      <h3 className="text-xl font-montserrat font-bold text-charcoal mb-4">
        Subscription Management
      </h3>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiAlertCircle} className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-600 font-lato">{error}</p>
          </div>
        </div>
      )}

      {/* Current Plan */}
      <div className={`border-2 rounded-lg p-4 mb-6 ${tierDetails.color}`}>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-montserrat font-bold text-charcoal">
              Current Plan: {tierDetails.name}
            </h4>
            <p className="text-sm font-lato text-gray-600 mt-1">
              {tierDetails.price}
            </p>
          </div>
          <SafeIcon icon={FiCreditCard} className="h-8 w-8 text-current" />
        </div>
      </div>

      {/* Subscription Details */}
      {user?.tier !== 'free' && (
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-lato text-gray-600">Status</span>
            <span className="font-montserrat font-bold text-green-600">
              {user.subscription_status || 'Active'}
            </span>
          </div>
          
          {user.last_payment_date && (
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="font-lato text-gray-600">Last Payment</span>
              <span className="font-lato text-charcoal">
                {new Date(user.last_payment_date).toLocaleDateString()}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="font-lato text-gray-600">Next Billing</span>
            <span className="font-lato text-charcoal">
              {/* Calculate next billing date */}
              {user.last_payment_date 
                ? new Date(new Date(user.last_payment_date).setMonth(new Date(user.last_payment_date).getMonth() + 1)).toLocaleDateString()
                : 'N/A'
              }
            </span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {user?.tier !== 'free' ? (
          <button
            onClick={handleManageSubscription}
            disabled={isLoading}
            className="w-full bg-charcoal text-white py-3 rounded-lg font-lato font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiSettings} className="h-4 w-4" />
            <span>
              {isLoading ? 'Loading...' : 'Manage Subscription'}
            </span>
          </button>
        ) : (
          <a
            href="/pricing"
            className="w-full bg-primary text-white py-3 rounded-lg font-lato font-medium hover:bg-red-800 transition-colors flex items-center justify-center space-x-2"
          >
            <SafeIcon icon={FiCreditCard} className="h-4 w-4" />
            <span>Upgrade Membership</span>
          </a>
        )}

        {user?.tier !== 'free' && (
          <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-lato font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
            <SafeIcon icon={FiDownload} className="h-4 w-4" />
            <span>Download Receipts</span>
          </button>
        )}
      </div>

      {/* Upgrade Options */}
      {user?.tier !== 'guild' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-montserrat font-bold text-charcoal mb-3">
            Upgrade Available
          </h4>
          <p className="text-sm font-lato text-gray-600 mb-3">
            Get access to more exclusive content and features with a higher tier membership.
          </p>
          <a
            href="/pricing"
            className="text-primary font-lato font-medium hover:text-red-800 text-sm"
          >
            View upgrade options →
          </a>
        </div>
      )}
    </motion.div>
  )
}

export default SubscriptionManager