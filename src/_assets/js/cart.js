document.addEventListener('DOMContentLoaded', async () => {
    // Initialisation des variables
    const sectionCart = document.getElementById('cart')
    const sectionNoCart = document.getElementById('no-cart')
    const cartContent = document.getElementById('cart-content')
    const shippingSelect = document.getElementById('shipping-country')
    const subtotalElement = document.querySelector('.subtotal-amount')
    const shippingElement = document.querySelector('.shipping-amount')
    const totalElement = document.querySelector('.total-amount')
    const cartLink = document.getElementById('cart-link')

    const isCartPage = sectionCart && sectionNoCart

    let productsData

    // Récupération des données du panier et de la langue
    const cartItems = storage.getCart()
    const currentLang = getActiveLanguage()
    const baseUrl = localStorage.getItem('baseUrl') || '/boutique-11ty'

    // Mise à jour initiale du lien du panier et de la visibilité du panier
    updateCartLink()

    if (isCartPage) {
        updateCartVisibility()

        productsData = await fetchProductsData(baseUrl, currentLang)

        if (cartItems.length !== 0) {
            initializeCart()
        }
        shippingSelect.addEventListener('change', calculateCartTotal)
    }

    /**
     * Fonction pour charger les données produits
     */
    async function fetchProductsData(baseUrl, currentLang) {
        try {
            const response = await fetch(
                `${baseUrl}/products_${currentLang}.json`
            )
            return await response.json()
        } catch (error) {
            console.error(
                'Erreur lors du chargement des données produits :',
                error
            )
            return []
        }
    }

    /**
     * Fonction pour initialiser le panier
     */
    function initializeCart() {
        cartItems.forEach((cartItem) => {
            const productData = productsData.find(
                (product) => product.id === cartItem.id
            )
            if (productData) {
                const itemElement = createCartItemElement(productData, cartItem)
                cartContent.appendChild(itemElement)
            }
        })

        // Ajout des écouteurs sur les boutons de suppression et de modification de quantité
        cartContent.addEventListener('click', handleCartContentClick)
        cartContent.addEventListener('change', handleCartContentChange)

        calculateCartTotal()
    }

    /**
     * Gestion des clics dans le contenu du panier
     */
    function handleCartContentClick(event) {
        const target = event.target

        if (target.classList.contains('remove-from-cart')) {
            event.preventDefault()
            const productId = target.dataset.id
            removeFromCart(productId)
        } else if (target.classList.contains('qty-count')) {
            handleButtonQuantityChange(target)
        }
    }

    /**
     * Gestion des changements dans le contenu du panier
     */
    function handleCartContentChange(event) {
        const target = event.target

        if (target.classList.contains('item-qty')) {
            handleQuantityChange(target)
        }
    }

    /**
     * Création de l'élément HTML pour un article du panier
     */
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
        }" />
            </figure>
            <section class="item-details">
                <data class="price" value="${
                    productData.price
                }" itemprop="price">
                    ${parseFloat(productData.price).toFixed(2)} €
                </data>
                <meta itemprop="priceCurrency" content="EUR" />
                <div class="qty-input">
                    <button class="qty-count qty-count--minus ${
                        cartItem.qty === 1 ? 'disabled' : ''
                    }" data-action="minus" type="button">-</button>
                    <label for="qty-${
                        cartItem.id
                    }" class="hidden">Quantité</label>
                    <input id="qty-${
                        cartItem.id
                    }" class="product-qty item-qty" type="number" name="product-qty" data-id="${
            cartItem.id
        }" min="1" max="10" value="${cartItem.qty}" />
                    <button class="qty-count qty-count--add ${
                        cartItem.qty === 10 ? 'disabled' : ''
                    }" data-action="add" type="button">+</button>
                </div>
                <data class="item-total-price price" value="${(
                    parseFloat(productData.price) * cartItem.qty
                ).toFixed(2)}" itemprop="price">
                    ${(parseFloat(productData.price) * cartItem.qty).toFixed(
                        2
                    )} €
                </data>
                <meta itemprop="priceCurrency" content="EUR" />
            </section>
            <footer class="product-footer">
                <a href="${
                    productData.link
                }" class="btn btn-details" aria-label="Revoir l'article">Revoir l'article</a>
                <a href="#" class="btn btn-card remove-from-cart" data-id="${
                    cartItem.id
                }" aria-label="Supprimer l'article">Supprimer l'article</a>
            </footer>`
        return itemElement
    }

    /**
     * Gestion de la modification de quantité via l'input
     */
    function handleQuantityChange(input) {
        const productId = input.dataset.id
        let newQty = parseInt(input.value)
        const min = parseInt(input.min)
        const max = parseInt(input.max)

        newQty = Math.min(Math.max(newQty, min), max)
        input.value = newQty

        updateCartItemQuantity(productId, newQty)
        updateItemTotalPrice(productId, newQty)
        updateButtonState(productId, newQty, min, max)
    }

    /**
     * Gestion de la modification de quantité via les boutons
     */
    function handleButtonQuantityChange(button) {
        const input = button.closest('.qty-input').querySelector('.item-qty')
        const productId = input.dataset.id
        let currentQty = parseInt(input.value)
        const min = parseInt(input.min)
        const max = parseInt(input.max)

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

    /**
     * Suppression d'un produit du panier
     */
    function removeFromCart(productId) {
        let cart = storage.getCart()
        cart = cart.filter((item) => item.id !== productId)
        storage.setCart(cart)

        // Supprimer l'élément du DOM
        const itemElement = document
            .querySelector(`#qty-${productId}`)
            .closest('.product-item')
        if (itemElement) {
            itemElement.remove()
        }

        calculateCartTotal()
        updateCartLink()
    }

    /**
     * Mise à jour de la quantité d'un article dans le panier
     */
    function updateCartItemQuantity(productId, newQty) {
        let cart = storage.getCart()
        cart = cart.map((item) =>
            item.id === productId ? { ...item, qty: newQty } : item
        )
        storage.setCart(cart)

        calculateCartTotal()
        updateCartLink()
    }

    /**
     * Mise à jour du prix total d'un article
     */
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

    /**
     * Mise à jour de l'état des boutons de quantité
     */
    function updateButtonState(productId, currentQty, min, max) {
        const qtyInput = document
            .querySelector(`#qty-${productId}`)
            .closest('.qty-input')
        const minusButton = qtyInput.querySelector('.qty-count--minus')
        const addButton = qtyInput.querySelector('.qty-count--add')

        minusButton.classList.toggle('disabled', currentQty <= min)
        addButton.classList.toggle('disabled', currentQty >= max)
    }

    /**
     * Calcul du total du panier
     */
    function calculateCartTotal() {
        const cartItems = storage.getCart()
        let subtotal = 0

        cartItems.forEach((cartItem) => {
            const productData = productsData.find(
                (product) => product.id === cartItem.id
            )
            if (productData) {
                const itemTotal = parseFloat(productData.price) * cartItem.qty
                subtotal += itemTotal

                const itemTotalElement = document
                    .querySelector(`#qty-${cartItem.id}`)
                    .closest('.item-details')
                    .querySelector('.item-total-price')
                itemTotalElement.textContent = `${itemTotal.toFixed(2)} €`
            }
        })

        const shippingCost = getShippingCost()
        const total = subtotal + shippingCost

        updateTicket(subtotal, shippingCost, total)
    }

    /**
     * Récupération du coût de livraison
     */
    function getShippingCost() {
        const selectedOption =
            shippingSelect.options[shippingSelect.selectedIndex]
        return parseFloat(selectedOption.dataset.cost) || 0
    }

    /**
     * Mise à jour du ticket récapitulatif
     */
    function updateTicket(subtotal, shippingCost, total) {
        subtotalElement.textContent = `${subtotal.toFixed(2)} €`
        shippingElement.textContent = `${shippingCost.toFixed(2)} €`
        totalElement.textContent = `${total.toFixed(2)} €`
    }

    /**
     * Récupération de la langue active
     */
    function getActiveLanguage() {
        const selectedLangElement = document.querySelector(
            '.language-list .btn-nav.selected'
        )
        return selectedLangElement
            ? selectedLangElement.textContent.trim().toLowerCase()
            : 'fr'
    }

    /**
     * Mise à jour de la visibilité du panier
     */
    function updateCartVisibility() {
        const cartItems = storage.getCart()
        if (cartItems.length === 0) {
            sectionCart.classList.add('hidden')
            sectionNoCart.classList.remove('hidden')
        } else {
            sectionCart.classList.remove('hidden')
            sectionNoCart.classList.add('hidden')
        }
    }

    /**
     * Mise à jour du lien du panier
     */
    function updateCartLink() {
        const cartItems = storage.getCart()
        if (cartLink) {
            cartLink.classList.toggle('disabled', cartItems.length === 0)
        }
    }
})
