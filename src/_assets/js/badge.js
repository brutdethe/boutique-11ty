const updateCartBadge = () => {
    const cart = storage.getCart()
    const badgeElement = document.querySelector('.badge[data-badge]')
    badgeElement.setAttribute('data-badge', cart.length)
}

// Déclaration de l'objet storage avec les méthodes getCart et setCart
export const storage = {
    getCart: () => JSON.parse(localStorage.getItem('cart') || '[]'),
    setCart: (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart))
        updateCartBadge()
    }
}
