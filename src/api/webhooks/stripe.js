import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key for admin operations
)

// Stripe webhook handler for automatic tier upgrades
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    // Verify webhook signature
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
}

async function handleCheckoutCompleted(session) {
  console.log('Checkout completed:', session.id)
  
  try {
    // Get customer email from session
    const customerEmail = session.customer_details?.email || session.customer_email
    
    if (!customerEmail) {
      console.error('No customer email found in session')
      return
    }

    // Determine tier based on price ID or amount
    const tier = getTierFromSession(session)
    
    // Update user tier in Supabase
    const { data: user, error: userError } = await supabase
      .from('profiles_chef_brigade')
      .select('id, email, tier')
      .eq('email', customerEmail)
      .single()

    if (userError) {
      console.error('Error finding user:', userError)
      return
    }

    if (!user) {
      console.error('User not found for email:', customerEmail)
      return
    }

    // Update user tier
    const { error: updateError } = await supabase
      .from('profiles_chef_brigade')
      .update({ 
        tier,
        stripe_customer_id: session.customer,
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating user tier:', updateError)
      return
    }

    // Add welcome badge for new subscribers
    if (tier !== 'free') {
      await addWelcomeBadge(user.id, tier)
    }

    // Send welcome email/notification
    await sendWelcomeNotification(user.id, tier)

    console.log(`Successfully upgraded user ${user.email} to ${tier}`)
    
  } catch (error) {
    console.error('Error in handleCheckoutCompleted:', error)
  }
}

async function handlePaymentSucceeded(invoice) {
  console.log('Payment succeeded for invoice:', invoice.id)
  
  try {
    const customerId = invoice.customer
    const subscriptionId = invoice.subscription

    // Find user by Stripe customer ID
    const { data: user, error: userError } = await supabase
      .from('profiles_chef_brigade')
      .select('id, email, tier')
      .eq('stripe_customer_id', customerId)
      .single()

    if (userError || !user) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Update subscription status
    const { error: updateError } = await supabase
      .from('profiles_chef_brigade')
      .update({ 
        subscription_status: 'active',
        last_payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating subscription status:', updateError)
    }

    console.log(`Payment processed for user ${user.email}`)
    
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error)
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log('Subscription created:', subscription.id)
  
  try {
    const customerId = subscription.customer
    const tier = getTierFromSubscription(subscription)

    // Find and update user
    const { data: user, error: userError } = await supabase
      .from('profiles_chef_brigade')
      .select('id, email')
      .eq('stripe_customer_id', customerId)
      .single()

    if (userError || !user) {
      console.error('User not found for customer:', customerId)
      return
    }

    const { error: updateError } = await supabase
      .from('profiles_chef_brigade')
      .update({ 
        tier,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('Error updating subscription:', updateError)
    }

    console.log(`Subscription created for user ${user.email} with tier ${tier}`)
    
  } catch (error) {
    console.error('Error in handleSubscriptionCreated:', error)
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log('Subscription updated:', subscription.id)
  
  try {
    const tier = getTierFromSubscription(subscription)

    const { error } = await supabase
      .from('profiles_chef_brigade')
      .update({ 
        tier,
        subscription_status: subscription.status,
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', subscription.id)

    if (error) {
      console.error('Error updating subscription:', error)
    }
    
  } catch (error) {
    console.error('Error in handleSubscriptionUpdated:', error)
  }
}

async function handleSubscriptionCanceled(subscription) {
  console.log('Subscription canceled:', subscription.id)
  
  try {
    // Downgrade user to free tier
    const { error } = await supabase
      .from('profiles_chef_brigade')
      .update({ 
        tier: 'free',
        subscription_status: 'canceled',
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', subscription.id)

    if (error) {
      console.error('Error handling subscription cancellation:', error)
    }
    
  } catch (error) {
    console.error('Error in handleSubscriptionCanceled:', error)
  }
}

async function handlePaymentFailed(invoice) {
  console.log('Payment failed for invoice:', invoice.id)
  
  try {
    const customerId = invoice.customer

    // Update subscription status
    const { error } = await supabase
      .from('profiles_chef_brigade')
      .update({ 
        subscription_status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Error updating payment failure:', error)
    }
    
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error)
  }
}

function getTierFromSession(session) {
  // Map Stripe price IDs to tiers
  const priceToTier = {
    'price_brigade_monthly': 'brigade',
    'price_fraternity_monthly': 'fraternity', 
    'price_guild_monthly': 'guild'
  }

  // Check line items for price ID
  if (session.line_items?.data) {
    for (const item of session.line_items.data) {
      const tier = priceToTier[item.price.id]
      if (tier) return tier
    }
  }

  // Fallback: determine by amount
  const amount = session.amount_total / 100 // Convert from cents
  
  if (amount >= 497) return 'guild'
  if (amount >= 97) return 'fraternity'  
  if (amount >= 19) return 'brigade'
  
  return 'free'
}

function getTierFromSubscription(subscription) {
  // Get tier from subscription price ID
  const priceId = subscription.items?.data?.[0]?.price?.id
  
  const priceToTier = {
    'price_brigade_monthly': 'brigade',
    'price_fraternity_monthly': 'fraternity',
    'price_guild_monthly': 'guild'
  }
  
  return priceToTier[priceId] || 'free'
}

async function addWelcomeBadge(userId, tier) {
  try {
    const badgeId = `${tier}-member`
    
    // Get current badges
    const { data: user, error: fetchError } = await supabase
      .from('profiles_chef_brigade')
      .select('badges')
      .eq('id', userId)
      .single()

    if (fetchError) {
      console.error('Error fetching user badges:', fetchError)
      return
    }

    const currentBadges = user.badges || []
    
    if (!currentBadges.includes(badgeId)) {
      const newBadges = [...currentBadges, badgeId]
      
      const { error: updateError } = await supabase
        .from('profiles_chef_brigade')
        .update({ badges: newBadges })
        .eq('id', userId)

      if (updateError) {
        console.error('Error adding badge:', updateError)
      }
    }
  } catch (error) {
    console.error('Error in addWelcomeBadge:', error)
  }
}

async function sendWelcomeNotification(userId, tier) {
  try {
    const welcomeMessages = {
      brigade: {
        title: 'Welcome to The Brigade! 🎉',
        message: 'You now have access to the full Leadership Library and monthly group coaching calls.'
      },
      fraternity: {
        title: 'Welcome to The Fraternity! 🚀',
        message: 'You now have access to biweekly Q&A sessions and leadership deep dives.'
      },
      guild: {
        title: 'Welcome to The Guild! 👑',
        message: 'You now have exclusive access to private strategy calls and masterminds.'
      }
    }

    const notification = welcomeMessages[tier]
    if (!notification) return

    // Add notification to user's notifications
    const { error } = await supabase
      .from('notifications_chef_brigade')
      .insert({
        user_id: userId,
        title: notification.title,
        message: notification.message,
        type: 'welcome',
        read: false,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error sending welcome notification:', error)
    }
  } catch (error) {
    console.error('Error in sendWelcomeNotification:', error)
  }
}