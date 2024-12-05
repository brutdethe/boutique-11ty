document.addEventListener('DOMContentLoaded', async () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart')

    initialize()

    async function initialize() {
            disableAddToCartButtonsForItemsInCart()
            addToCartButtonEventListener()
    }

    function disableAddToCartButtonsForItemsInCart() {
        const cart = storage.getCart()
        addToCartButtons.forEach((button) => {
            const productElement = button.closest('.item-infos')
            if (productElement) {
                const productId = productElement.dataset.id
                if (cart.some(item => item.id === productId)) {
                    disableButton(button)
                }
            }
        })
    }

    function addToCartButtonEventListener() {
        document.addEventListener('click', (event) => {
            if (event.target.matches('.add-to-cart')) {
                const button = event.target
                const productElement = button.closest('.item-infos')
                if (!productElement) return

                const productId = String(productElement.dataset.id)

                if (!isProductInCart(productId)) {
                    event.preventDefault()
                    addToCart({ id: productId, qty: 1 })
                    disableButton(button)
                }
            }
        })
    }

    function addToCart(product) {
        const cart = storage.getCart()
        if (!cart.some((item) => item.id === product.id)) {
            cart.push(product)
            storage.setCart(cart)
            updateCartLink()
        }
    }

    function disableButton(button) {
        button.classList.add('disabled')
        button.textContent = button.dataset.addedText
        button.disabled = true
    }

    function isProductInCart(productId) {
        return storage.getCart().some((item) => item.id === productId)
    }
})