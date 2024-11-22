const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée. Utilisez POST.' }),
    };
  }

  try {
    // Parse le corps de la requête
    const { cartItems } = JSON.parse(event.body);

    // Vérifier que cartItems est un tableau et qu'il contient des éléments
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Le panier est vide ou mal formaté.' }),
      };
    }

    // Construire les éléments de ligne pour Stripe avec price_data
    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: 'eur', // Remplacez par votre devise
        product_data: {
          name: item.name, // Nom du produit depuis votre site
          description: item.description || '', // Description optionnelle
        },
        unit_amount: Math.round(item.price * 100), // Prix en cents
      },
      quantity: item.quantity,
    }));

    // Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: `${process.env.URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/cancel.html`,
    });

    // Retourner l'ID de la session
    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Erreur lors de la création de la session de paiement :', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Une erreur est survenue lors de la création de la session de paiement.' }),
    };
  }
};

