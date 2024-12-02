document.addEventListener('DOMContentLoaded', async () => {
    const translations = {
        button_remove: {
            fr: "supprimer",
            en: 'remove'
        },
        button_detail: {
            fr: "revoir l'article",
            en: 'item detail'
        },
        button_add_qty: {
            fr: 'augmenter la quantité',
            en: 'increase the quantity'
        },
        button_remove_qty: {
            fr: 'diminuer la quantité',
            en: 'reduce the quantity'
        },
        quantity: {
            fr: 'quantité',
            en: 'quantity'
        }
    }

    const storage = {
        getCart: () => JSON.parse(localStorage.getItem('cart') || '[]'),
        setCart: (cart) => {
            localStorage.setItem('cart', JSON.stringify(cart))
            updateCartBadge()
        },
        getCountry: () => localStorage.getItem('country') || 'FR',
        setCountry: (country) => {
            localStorage.setItem('country', country)
        }
    }

    const sectionCart = document.getElementById('cart')
    const sectionNoCart = document.getElementById('no-cart')
    const cartContent = document.getElementById('cart-content')
    const shippingSelect = document.getElementById('destination')
    const subtotalElement = document.querySelector('.subtotal-amount')
    const shippingElement = document.querySelector('.shipping-amount')
    const totalElement = document.querySelector('.total-amount')
    const cartLink = document.getElementById('cart-link')
    const cartFloatLink = document.getElementById('floating-cart')
    const addToCartButtons = document.querySelectorAll('.add-to-cart')
    const checkoutButton = document.getElementById('checkout-button')
    const fullscreenLoader = document.getElementById('fullscreen-loader')
    const successPayment = document.getElementById('payment-successed')

    const currentLang = getActiveLanguage()

    let totalShippingCost = 0;
    let productsData

    initialize()

    async function initialize() {
        successPayment && resetCartForSuccessPayment()
        updateCartLink()
        updateCartBadge()
        disableAddToCartButtonsForItemsInCart()
        addToCartButtonEventListener()
        checkoutButton && checkoutButtonEventListener(currentLang)

        if (sectionCart && sectionNoCart) {
            if (shippingSelect) {
                setSelectedCountry()
                shippingSelect.addEventListener('change', () => {
                    const selectedCountryIso = shippingSelect.selectedOptions[0].getAttribute('data-iso')
                    storage.setCountry(selectedCountryIso)
                    calculateCartTotal()
                })
            }
            updateCartVisibility()
            productsData = await fetchProductsData(currentLang)

            if (storage.getCart().length !== 0) {
                initializeCart()
            }
        }
    }

    function t(key) {
        return translations[key]?.[currentLang] || key
    }

    function resetCartForSuccessPayment() {
        storage.setCart([])
    }

    function updateCartBadge() {
        const cart = storage.getCart()
        const badgeElement = document.querySelector('.badge[data-badge]')
        if (badgeElement) {
            badgeElement.setAttribute('data-badge', cart.length)
        }
    }

    function updateCartLink() {
        const cartItems = storage.getCart()
        cartLink.classList.toggle('disabled', cartItems.length === 0)
        cartFloatLink.classList.toggle('hidden', cartItems.length === 0)
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

    async function fetchProductsData(currentLang) {
        try {
            const response = await fetch(`/products_${currentLang}.json`)
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return await response.json()
        } catch (error) {
            console.error('Erreur lors du chargement des données produits :', error)
            return []
        }
    }

    function initializeCart() {
        const cartItems = storage.getCart()
        cartItems.forEach((cartItem) => {
            const productData = productsData.find((product) => String(product.id) === String(cartItem.id))
            if (productData) {
                const itemElement = createCartItemElement(productData, cartItem)
                cartContent.appendChild(itemElement)
            }
        })

        cartContent.addEventListener('click', handleCartContentClick)
        cartContent.addEventListener('change', handleCartContentChange)

        calculateCartTotal()
    }

    function handleCartContentClick(event) {
        const target = event.target

        if (target.classList.contains('remove-from-cart')) {
            event.preventDefault()
            removeFromCart(target.dataset.id)
        } else if (target.classList.contains('qty-count')) {
            handleButtonQuantityChange(target)
        }
    }

    function handleCartContentChange(event) {
        if (event.target.classList.contains('item-qty')) {
            updateQuantity(event.target)
        }
    }

    function createCartItemElement(productData, cartItem) {
        const itemElement = document.createElement('article')
        itemElement.classList.add('item')
        itemElement.classList.add('shadow')
        itemElement.innerHTML = `
            <header class="item-header">
                <h2 id="${productData.title}" class="item-title">${productData.title}</h2>
            </header>
            <figure class="item-figure">
                <img src="${productData.image}" class="item-image" alt="${productData.title}" />
            </figure>
            <section class="item-details">
                <data class="price" value="${productData.price}" itemprop="price">
                    ${parseFloat(productData.price).toFixed(2)} €
                </data>
                <meta itemprop="priceCurrency" content="EUR" />
                <div class="qty-input">
                    <button class="qty-count qty-count--minus ${cartItem.qty === 1 ? 'disabled' : ''}" data-action="minus" type="button" aria-label="${t('button_remove_qty')}">
                        -
                    </button>
                    <label for="qty-${cartItem.id}" class="display-none">${t('quantity')}</label>
                    <input id="qty-${cartItem.id}" class="item-qty item-qty" type="number" name="item-qty" data-id="${cartItem.id}" min="1" max="${productData.stock || 10}" value="${cartItem.qty}" />
                    <button class="qty-count qty-count--add ${cartItem.qty === +productData.stock ? 'disabled' : ''}" data-action="add" type="button" aria-label="${t('button_add_qty')}">
                        +
                    </button>
                </div>
                <data class="item-total-price price" value="${(parseFloat(productData.price) * cartItem.qty).toFixed(2)}" itemprop="price">
                    ${(parseFloat(productData.price) * cartItem.qty).toFixed(2)} €
                </data>
                <meta itemprop="priceCurrency" content="EUR" />
            </section>
            <footer class="item-footer">
                <a href="${productData.link}" class="btn btn-details" aria-label="${t('button_detail')}">
                    ${t('button_detail')}
                </a>
                <a href="#" class="btn btn-card remove-from-cart" data-id="${cartItem.id}" aria-label="${t('button_remove')}">
                    ${t('button_remove')}
                </a>
            </footer>`
        return itemElement
    }

    function updateQuantity(input, delta = 0) {
        const productId = input.dataset.id
        let newQty = parseInt(input.value) + delta
        const min = parseInt(input.min)
        const max = parseInt(input.max)

        newQty = Math.min(Math.max(newQty, min), max)
        input.value = newQty

        updateCartItemQuantity(productId, newQty)
        updateItemTotalPrice(productId, newQty)
        updateButtonState(productId, newQty, min, max)
    }

    function handleButtonQuantityChange(button) {
        const input = button.closest('.qty-input').querySelector('.item-qty')
        const delta = button.dataset.action === 'add' ? 1 : -1
        updateQuantity(input, delta)
    }

    function removeFromCart(productId) {
        let cart = storage.getCart()
        cart = cart.filter((item) => item.id !== productId)
        storage.setCart(cart)

        const qtyInput = document.querySelector(`#qty-${productId}`)
        if (qtyInput) {
            const itemElement = qtyInput.closest('.item')
            if (itemElement) {
                itemElement.remove()
            }
        }

        calculateCartTotal()
        updateCartLink()
        updateCartVisibility()
    }

    function updateCartItemQuantity(productId, newQty) {
        let cart = storage.getCart()
        cart = cart.map((item) => item.id === productId ? { ...item, qty: newQty } : item)
        storage.setCart(cart)
        calculateCartTotal()
        updateCartLink()
    }

    function updateItemTotalPrice(productId, newQty) {
        const productData = productsData.find((product) => String(product.id) === String(productId))
        if (productData) {
            const qtyInput = document.querySelector(`#qty-${productId}`)
            if (qtyInput) {
                const itemTotalElement = qtyInput.closest('.item-details').querySelector('.item-total-price')
                if (itemTotalElement) {
                    const itemTotal = parseFloat(productData.price) * newQty
                    itemTotalElement.textContent = `${itemTotal.toFixed(2)} €`
                }
            }
        }
    }

    function updateButtonState(productId, currentQty, min, max) {
        const qtyInput = document.querySelector(`#qty-${productId}`)
        if (qtyInput) {
            const qtyInputContainer = qtyInput.closest('.qty-input')
            const minusButton = qtyInputContainer.querySelector('.qty-count--minus')
            const addButton = qtyInputContainer.querySelector('.qty-count--add')

            minusButton.classList.toggle('disabled', currentQty <= min)
            addButton.classList.toggle('disabled', currentQty >= max)
        }
    }

    function calculateCartTotal() {
        const cartItems = storage.getCart()
        let subtotal = 0
        let hasShipping = false
        let shippingGroups = {}
        totalShippingCost = 0

        cartItems.forEach((cartItem) => {
            const productData = productsData.find((product) => String(product.id) === String(cartItem.id))
            if (productData) {
                const itemTotal = parseFloat(productData.price) * cartItem.qty
                subtotal += itemTotal

                if (productData.shipping_type !== 'sans_envoi') {
                    if (!shippingGroups[productData.shipping_type]) {
                        shippingGroups[productData.shipping_type] = {
                            totalPoints: 0,
                            totalWeight: 0,
                            colisData: shippingData.types_colis[productData.shipping_type]
                        }
                    }
                    shippingGroups[productData.shipping_type].totalPoints += productData.shipping_point * cartItem.qty
                    shippingGroups[productData.shipping_type].totalWeight += parseFloat(productData.weight) * cartItem.qty
                }
            }
        })

        Object.keys(shippingGroups).forEach((shippingType) => {
            const group = shippingGroups[shippingType]
            const colisCapacity = group.colisData.capacite_points
            const numberOfColis = Math.ceil(group.totalPoints / colisCapacity)
            const totalWeight = group.totalWeight + (group.colisData.poids_emballage * numberOfColis)
            const selectedZone = shippingSelect.value
            const cost = calculateCostForColis(totalWeight, selectedZone)
            totalShippingCost += cost
            hasShipping = true
        })

        if (!hasShipping && shippingSelect) {
            shippingSelect.classList.add('disabled')
        } else if (shippingSelect) {
            shippingSelect.classList.remove('disabled')
        }

        const total = subtotal + totalShippingCost
        updateTicket(subtotal, totalShippingCost, total)
    }

    function calculateCostForColis(totalWeight, selectedZone) {
        const tarifs = shippingData.grille_tarifs[selectedZone].tarifs
        const tarif = tarifs.find(t => totalWeight <= t.poids_max)
        return tarif ? tarif.tarif : 0
    }

    function updateTicket(subtotal, shippingCost, total) {
        subtotalElement.textContent = `${subtotal.toFixed(2)} €`
        shippingElement.textContent = `${shippingCost.toFixed(2)} €`
        totalElement.textContent = `${total.toFixed(2)} €`
    }

    function getActiveLanguage() {
        const selectedLangElement = document.querySelector('.language-list .btn-nav.selected')
        return selectedLangElement ? selectedLangElement.textContent.trim().toLowerCase() : 'fr'
    }

    function updateCartVisibility() {
        const cartItems = storage.getCart()
        if (sectionCart && sectionNoCart) {
            if (cartItems.length === 0) {
                sectionCart.classList.add('display-none')
                sectionNoCart.classList.remove('display-none')
            } else {
                sectionCart.classList.remove('display-none')
                sectionNoCart.classList.add('display-none')
            }
        }
    }

    function setSelectedCountry() {
        const countryIso = storage.getCountry()
        const options = shippingSelect.options
    
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            if (option.getAttribute('data-iso') === countryIso) {
                option.selected = true
                break;
            }
        }
    }


    function checkoutButtonEventListener(currentLang) {
        checkoutButton.addEventListener('click', async (event) => {
            event.preventDefault()
            fullscreenLoader.classList.add('loader-visible')
  
            const cartData = JSON.parse(localStorage.getItem('cart')) || []
        
            try {
                const response = await fetch('/.netlify/functions/create-checkout-session', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        cartItems: cartData,
                        currentLang: currentLang,
                        shippingAmount: totalShippingCost,
                        country: storage.getCountry()
                     }),
                })
            
                const { sessionId } = await response.json()
            
                const stripe = Stripe('pk_test_51HEFz3GJpQWhfcWwXgkgoLbJ1GLgViXGqYfWSgBQwzudrYdsQiMhdVkGWHQvRPx3sTMLNsRXvB2B6pdF1GEpQ9Ka00kz6AoFmS')
                await stripe.redirectToCheckout({ sessionId })
            
            } catch (err) {
                console.error('Erreur lors de la création de la session de paiement :', err)
            }
        })
    }
})
