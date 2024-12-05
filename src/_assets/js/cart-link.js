const storage = {
    getCart: () => JSON.parse(localStorage.getItem('cart') || '[]'),
    setCart: (cart) => {
        localStorage.setItem('cart', JSON.stringify(cart))
        updateCartBadge()
    }
}

function updateCartLink() {
    const cartLink = document.getElementById('cart-link')
    const cartFloatLink = document.getElementById('floating-cart')

    const cartItems = storage.getCart()
    cartLink.classList.toggle('disabled', cartItems.length === 0)
    cartFloatLink.classList.toggle('hidden', cartItems.length === 0)
}

function updateCartBadge() {
    const badgeElement = document.querySelector('.badge[data-badge]')

    const cart = storage.getCart()
    if (badgeElement) {
        badgeElement.setAttribute('data-badge', cart.length)
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    initialize()

    async function initialize() {
        updateCartLink()
        updateCartBadge()
    }
})