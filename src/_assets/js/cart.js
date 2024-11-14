document.addEventListener('DOMContentLoaded', () => {
    const cartItems = storage.getCart()
    const cartContent = document.getElementById('cart-content')
    if (cartItems.length === 0) {
        cartContent.innerHTML = '<p>Votre panier est vide.</p>'
    } else {
        // Créer des éléments HTML pour chaque article du panier
        cartItems.forEach((item) => {
            const itemElement = document.createElement('div')
            itemElement.classList.add('cart-item')
            itemElement.innerHTML = `
            <h3>${item.title}</h3>
            <p>Prix : ${item.price}</p>
            <p>Quantité : ${item.qty}</p>
            <a href="${item.link}">Voir le produit</a>
            <button class="remove-from-cart" data-id="${item.id}">Supprimer</button>
        `
            cartContent.appendChild(itemElement)
        })

        // Ajouter les écouteurs pour la suppression des articles
        document.querySelectorAll('.remove-from-cart').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault()
                const productId = button.dataset.id
                removeFromCart(productId)
            })
        })
    }
})

// Fonction pour supprimer un article du panier
function removeFromCart(productId) {
    let cart = storage.getCart()
    cart = cart.filter((item) => item.id !== productId)
    storage.setCart(cart)
    location.reload()
}
