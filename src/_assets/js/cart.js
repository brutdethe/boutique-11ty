document.addEventListener('DOMContentLoaded', async () => {
    const cartItems = storage.getCart()
    const cartContent = document.getElementById('cart-content')
    const shippingSelect = document.getElementById('shipping-country')
    const subtotalElement = document.querySelector('.subtotal-amount')
    const shippingElement = document.querySelector('.shipping-amount')
    const totalElement = document.querySelector('.total-amount')

    const currentLang = getActiveLanguage()
    const baseUrl = localStorage.getItem('baseUrl') || '/boutique-11ty'

    let productsData = []
    try {
        const response = await fetch(`${baseUrl}/products_${currentLang}.json`)
        productsData = await response.json()
    } catch (error) {
        console.error('Erreur lors du chargement des données produits :', error)
        return
    }

    if (cartItems.length === 0) {
        cartContent.innerHTML = '<p>Votre panier est vide.</p>'
        updateTicket(0, getShippingCost())
    } else {
        cartItems.forEach((cartItem) => {
            const productData = productsData.find(
                (product) => product.id === cartItem.id
            )
            if (productData) {
                const itemElement = createCartItemElement(productData, cartItem)
                cartContent.appendChild(itemElement)
            }
        })

        document.querySelectorAll('.remove-from-cart').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault()
                const productId = button.dataset.id
                removeFromCart(productId)
            })
        })

        document.querySelectorAll('.item-qty').forEach((input) => {
            input.addEventListener('change', (event) => {
                handleQuantityChange(input)
            })
        })

        document.querySelectorAll('.qty-count').forEach((button) => {
            button.addEventListener('click', (event) => {
                handleButtonQuantityChange(button)
            })
        })

        calculateCartTotal()
    }

    shippingSelect.addEventListener('change', () => {
        calculateCartTotal()
    })

    function createCartItemElement(productData, cartItem) {
        const itemElement = document.createElement('article')
        itemElement.classList.add('product-item')
        itemElement.innerHTML = `
<header class="product-header">
    <h2 id="${productData.title}" class="product-title">
        ${productData.title}
    </h2>
</header>
<figure class="product-figure">
    <img src="${productData.image}" class="product-image" alt="${
            productData.title
        }"/>
</figure>
<section class="item-details">
    <data class="price" value="${productData.price}" itemprop="price">${
            productData.price
        }</data>
    <meta itemprop="priceCurrency" content="EUR" />
    <div class="qty-input">
        <button class="qty-count qty-count--minus ${
            cartItem.qty === 1 ? 'disabled' : ''
        }" data-action="minus" type="button">-</button>
        <label for="qty-${cartItem.id}" class="visually-hidden">Quantité</label>
        <input id="qty-${
            cartItem.id
        }" class="product-qty item-qty" type="number" name="product-qty" data-id="${
            cartItem.id
        }" min="1" max="10" value="${cartItem.qty}" >
        <button class="qty-count qty-count--add ${
            cartItem.qty === 10 ? 'disabled' : ''
        }" data-action="add" type="button">+</button>
    </div>
    <data class="item-total-price price" value="${(
        parseFloat(productData.price) * cartItem.qty
    ).toFixed(2)}" itemprop="price">${(
            parseFloat(productData.price) * cartItem.qty
        ).toFixed(2)} €</data>
    <meta itemprop="priceCurrency" content="EUR" />
</section>
<footer class="product-footer">
    <a href="${
        productData.link
    }" class="btn btn-details" aria-label="Revoir l'article">Revoir l'article</a>
    <a href="#" class="btn btn-card add-to-cart remove-from-cart" data-id="${
        cartItem.id
    }" aria-label="Supprimer l'article">Supprimer l'article</a>
</footer>`
        return itemElement
    }

    function handleQuantityChange(input) {
        const productId = input.dataset.id
        let newQty = parseInt(input.value)
        const min = parseInt(input.getAttribute('min'))
        const max = parseInt(input.getAttribute('max'))

        if (newQty < min) {
            newQty = min
        } else if (newQty > max) {
            newQty = max
        }

        input.value = newQty
        updateCartItemQuantity(productId, newQty)
        updateItemTotalPrice(productId, newQty)
        updateButtonState(productId, newQty, min, max)
    }

    function handleButtonQuantityChange(button) {
        const input = button.closest('.qty-input').querySelector('.item-qty')
        const productId = input.dataset.id
        let currentQty = parseInt(input.value)
        const min = parseInt(input.getAttribute('min'))
        const max = parseInt(input.getAttribute('max'))

        if (button.dataset.action === 'add' && currentQty < max) {
            currentQty++
        } else if (button.dataset.action === 'minus' && currentQty > min) {
            currentQty--
        }

        input.value = currentQty
        updateCartItemQuantity(productId, currentQty)
        updateItemTotalPrice(productId, currentQty)
        updateButtonState(productId, currentQty, min, max)
    }

    function removeFromCart(productId) {
        let cart = storage.getCart()
        cart = cart.filter((item) => item.id !== productId)
        storage.setCart(cart)
        location.reload()
    }

    function updateCartItemQuantity(productId, newQty) {
        let cart = storage.getCart()
        cart = cart.map((item) => {
            if (item.id === productId) {
                return {
                    ...item,
                    qty: newQty
                }
            }
            return item
        })
        storage.setCart(cart)
        calculateCartTotal()
    }

    function updateItemTotalPrice(productId, newQty) {
        const productData = productsData.find(
            (product) => product.id === productId
        )
        if (productData) {
            const itemTotalElement = document
                .querySelector(`#qty-${productId}`)
                .closest('.item-details')
                .querySelector('.item-total-price')
            itemTotalElement.textContent = `${(
                parseFloat(productData.price) * newQty
            ).toFixed(2)} €`
        }
    }

    function updateButtonState(productId, currentQty, min, max) {
        const minusButton = document
            .querySelector(`#qty-${productId}`)
            .closest('.qty-input')
            .querySelector('.qty-count--minus')
        const addButton = document
            .querySelector(`#qty-${productId}`)
            .closest('.qty-input')
            .querySelector('.qty-count--add')

        minusButton.classList.toggle('disabled', currentQty <= min)
        addButton.classList.toggle('disabled', currentQty >= max)
    }

    function calculateCartTotal() {
        const cartItems = storage.getCart()
        let subtotal = 0

        cartItems.forEach((cartItem) => {
            const productData = productsData.find(
                (product) => product.id === cartItem.id
            )
            if (productData) {
                subtotal += parseFloat(productData.price) * cartItem.qty

                const itemTotalElement = document
                    .querySelector(`#qty-${cartItem.id}`)
                    .closest('.item-details')
                    .querySelector('.item-total-price')
                itemTotalElement.textContent = `${(
                    parseFloat(productData.price) * cartItem.qty
                ).toFixed(2)} €`
            }
        })

        const shippingCost = getShippingCost()
        const total = subtotal + shippingCost

        updateTicket(subtotal, shippingCost, total)
    }

    function getShippingCost() {
        const selectedOption =
            shippingSelect.options[shippingSelect.selectedIndex]
        return parseFloat(selectedOption.dataset.cost)
    }

    function updateTicket(
        subtotal,
        shippingCost,
        total = subtotal + shippingCost
    ) {
        subtotalElement.textContent = `${subtotal.toFixed(2)} €`
        shippingElement.textContent = `${shippingCost.toFixed(2)} €`
        totalElement.textContent = `${total.toFixed(2)} €`
    }

    function getActiveLanguage() {
        const selectedLangElement = document.querySelector(
            '.language-list .btn-nav.selected'
        )
        return selectedLangElement
            ? selectedLangElement.textContent.trim().toLowerCase()
            : 'fr'
    }
})
