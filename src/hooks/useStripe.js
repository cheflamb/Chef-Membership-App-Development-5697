import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'

export const useStripe = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  // Create Stripe checkout session
  const createCheckoutSession = useCallback(async (priceId, successUrl, cancelUrl) => {
    if (!user) {
      throw new Error('User must be logged in to make a purchase')
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId,
          customerEmail: user.email,
          userId: user.id,
          successUrl,
          cancelUrl
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe checkout
      window.location.href = url
      
    } catch (error) {
      console.error('Error creating checkout session:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Create billing portal session for subscription management
  const createBillingPortalSession = useCallback(async () => {
    if (!user || !user.stripe_customer_id) {
      throw new Error('No active subscription found')
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/create-billing-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: user.stripe_customer_id,
          returnUrl: window.location.origin + '/my-chefcoat'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create billing portal session')
      }

      const { url } = await response.json()
      
      // Redirect to Stripe billing portal
      window.location.href = url
      
    } catch (error) {
      console.error('Error creating billing portal session:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user])

  return {
    createCheckoutSession,
    createBillingPortalSession,
    isLoading
  }
}