import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { priceId, customerEmail, userId, successUrl, cancelUrl } = req.body

    // Create or retrieve customer
    let customer
    try {
      const customers = await stripe.customers.list({
        email: customerEmail,
        limit: 1
      })
      
      if (customers.data.length > 0) {
        customer = customers.data[0]
      } else {
        customer = await stripe.customers.create({
          email: customerEmail,
          metadata: {
            userId: userId
          }
        })
      }
    } catch (error) {
      console.error('Error with customer:', error)
      return res.status(500).json({ error: 'Failed to create customer' })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${req.headers.origin}/my-chefcoat?success=true`,
      cancel_url: cancelUrl || `${req.headers.origin}/pricing?canceled=true`,
      metadata: {
        userId: userId
      },
      subscription_data: {
        metadata: {
          userId: userId
        }
      }
    })

    res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}