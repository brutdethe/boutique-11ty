import Stripe from 'stripe'

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY)

async function getProducts(currentLang) {
  const response = await fetch(`${process.env.URL}/products_${currentLang}.json`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  products = await response.json()
  return products
}

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }),
    }
  }

  try {
    const { cartItems, currentLang, shippingAmount, country } = JSON.parse(event.body)
    const products = await getProducts(currentLang)

    if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.some(item => !item.id || typeof item.qty !== 'number' || item.qty <= 0)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Le panier est vide ou mal formaté.' }),
      }
    }

    const line_items = cartItems.map((item) => {
      const product = products.find(p => p.id === item.id)
      if (!product) {
        throw new Error(`Produit avec ID ${item.id} non trouvé.`)
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${product.title} - ${item.id}`,
            description: product.descr || '',
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.qty,
      }
    })

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.URL}${currentLang === 'en' ? '/en' : ''}/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}${currentLang === 'en' ? '/en' : ''}/cancel/`,
      shipping_address_collection: {
        allowed_countries: [country],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: Math.round(shippingAmount*100),
              currency: 'eur',
            },
            display_name: 'Livraison Standard',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 3,
              },
              maximum: {
                unit: 'business_day',
                value: 5,
              },
            },
          },
        },
      ],
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    }
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement :', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Une erreur est survenue lors de la création de la session de paiement : ${error.message}` }),
    }
  }
}
