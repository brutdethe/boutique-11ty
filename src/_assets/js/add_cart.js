document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge()
    updateCartLink()

    document.querySelectorAll('.add-to-cart').forEach((button) => {
        const productElement = button.closest('.product-infos')
        const productId = productElement.dataset.id

        if (isProductInCart(productId)) {
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
        const cart = storage.getCart() // Récupère le panier mis à jour
        if (!cart.some((item) => item.id === product.id)) {
            cart.push(product)
            storage.setCart(cart)
            updateCartBadge()
            updateCartLink()
        }
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

    function isProductInCart(productId) {
        const cart = storage.getCart()
        return cart.some((item) => item.id === productId)
    }
})
