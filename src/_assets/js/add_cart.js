document.addEventListener('DOMContentLoaded', function () {
    updateCartBadge()

    const addToCartButtons = document.querySelectorAll('.add-to-cart')
    const cart = storage.getCart()

    addToCartButtons.forEach((button) => {
        const productElement = button.closest('.product-infos')
        const productId = productElement.dataset.id

        const isProductInCart = cart.some((item) => item.id === productId)

        if (isProductInCart) {
            button.classList.add('buyed')
            button.textContent = 'Déjà ajouté'
        } else {
            button.addEventListener('click', function (event) {
                event.preventDefault()

                const product = {
                    id: productElement.dataset.id,
                    qty: 1
                }

                addToCart(product)
                button.classList.add('buyed')
            })
        }
    })

    function addToCart(product) {
        cart.push(product)
        storage.setCart(cart)
    }
})
