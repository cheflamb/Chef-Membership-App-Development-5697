import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { customerId, returnUrl } = req.body

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${req.headers.origin}/my-chefcoat`,
    })

    res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    res.status(500).json({ error: 'Failed to create billing portal session' })
  }
}