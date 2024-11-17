document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge()

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
    }

    function disableButton(button) {
        button.classList.add('disabled')
        button.textContent = button.dataset.addedText
    }
})
