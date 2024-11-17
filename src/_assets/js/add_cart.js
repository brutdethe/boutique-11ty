document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge()
    updateCartLink()

    const cart = storage.getCart()

    document.querySelectorAll('.add-to-cart').forEach((button) => {
        const productElement = button.closest('.product-infos')
        const productId = productElement.dataset.id

        if (cart.some((item) => item.id === productId)) {
            disableButton(button)
        } else {
            button.addEventListener('click', (event) => {
                event.preventDefault()
                addToCart({ id: productId, qty: 1 })
                disableButton(button)
            })
        }
    })

    function addToCart(product) {
        cart.push(product)
        storage.setCart(cart)
        updateCartBadge()
        updateCartLink() // Mettre à jour le lien du panier après l'ajout
    }

    function disableButton(button) {
        button.classList.add('disabled')
        button.textContent = button.dataset.addedText
    }

    function updateCartLink() {
        const cartItems = storage.getCart()
        const cartLink = document.getElementById('cart-link')
        if (cartLink) {
            if (cartItems.length === 0) {
                cartLink.classList.add('disabled')
            } else {
                cartLink.classList.remove('disabled')
            }
        }
    }
})
