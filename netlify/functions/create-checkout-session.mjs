import Stripe from 'stripe';

const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
let productsCache = null;

async function getProducts() {
  if (productsCache) {
    return productsCache;
  }
  const response = await fetch(`${process.env.URL}/products_fr.json`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  productsCache = await response.json();
  return productsCache;
}

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }),
    };
  }

  try {
    const products = await getProducts();
    const { cartItems, currentLang } = JSON.parse(event.body);

    // Vérifier que cartItems est un tableau et qu'il contient des éléments
    if (!Array.isArray(cartItems) || cartItems.length === 0 || cartItems.some(item => !item.id || typeof item.qty !== 'number' || item.qty <= 0)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Le panier est vide ou mal formaté.' }),
      };
    }

    // Construire les éléments de ligne pour Stripe avec price_data
    const line_items = cartItems.map((item) => {
      const product = products.find(p => p.id === item.id);
      if (!product) {
        throw new Error(`Produit avec ID ${item.id} non trouvé.`);
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${product.title} - ${item.id}`,
            description: product.descr || '',
          },
          unit_amount: Math.round(product.price * 100),
          currency: 'eur'
        },
        quantity: item.qty,
      };
    });

    // Créer une session de paiement Stripe
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.URL}${currentLang === 'en' ? '/en' : ''}/success/?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}${currentLang === 'en' ? '/en' : ''}/cancel/`,
      shipping_address_collection: {
        allowed_countries: ['FR'],
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement :', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Une erreur est survenue lors de la création de la session de paiement : ${error.message}` }),
    };
  }
};
