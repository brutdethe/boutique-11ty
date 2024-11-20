document.addEventListener('DOMContentLoaded', async () => {
    const translations = {
        button_remove: {
            fr: "supprimer l'article",
            en: 'remove item'
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

    function t(key) {
        const currentLang = getActiveLanguage()

        return translations[key] && translations[key][currentLang]
            ? translations[key][currentLang]
            : key
    }

    // Initialisation des variables
    const sectionCart = document.getElementById('cart')
    const sectionNoCart = document.getElementById('no-cart')
    const cartContent = document.getElementById('cart-content')
    const shippingSelect = document.getElementById('destination')
    const subtotalElement = document.querySelector('.subtotal-amount')
    const shippingElement = document.querySelector('.shipping-amount')
    const totalElement = document.querySelector('.total-amount')
    const cartLink = document.getElementById('cart-link')
    const cartFloatLink = document.getElementById('floating-cart')

    const isCartPage = sectionCart && sectionNoCart

    // Déclaration de l'objet storage avec les méthodes getCart et setCart
    const storage = {
        getCart: () => JSON.parse(localStorage.getItem('cart') || '[]'),
        setCart: (cart) => {
            localStorage.setItem('cart', JSON.stringify(cart))
            updateCartBadge()
        }
    }

    // Fonction pour mettre à jour le badge du panier
    const updateCartBadge = () => {
        const cart = storage.getCart()
        const badgeElement = document.querySelector('.badge[data-badge]')
        if (badgeElement) {
            badgeElement.setAttribute('data-badge', cart.length)
        }
    }

    let productsData

    // Récupération des données du panier et de la langue
    const cartItems = storage.getCart()
    const currentLang = getActiveLanguage()
    const baseUrl = localStorage.getItem('baseUrl') || '/boutique-11ty'

    // Mise à jour initiale du lien du panier et de la visibilité du panier
    updateCartLink()
    updateCartBadge()

    // Vérifier l'existence de .add-to-cart pour éviter les erreurs
    const addToCartButtons = document.querySelectorAll('.add-to-cart')
    if (addToCartButtons.length > 0) {
        // Utilisation de la délégation d'événements
        document.addEventListener('click', (event) => {
            if (event.target.matches('.add-to-cart')) {
                const button = event.target
                const productElement = button.closest('.product-infos')
                if (!productElement) return

                const productId = String(productElement.dataset.id)

                if (isProductInCart(productId)) {
                    disableButton(button)
                } else {
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
        button.disabled = true // Amélioration de l'accessibilité
    }

    function updateCartLink() {
        const cartItems = storage.getCart()
        if (cartLink) {
            cartLink.classList.toggle('disabled', cartItems.length === 0)
        }
        if (cartFloatLink) {
            cartFloatLink.classList.toggle('hidden', cartItems.length === 0)
        }
    }

    function isProductInCart(productId) {
        const cart = storage.getCart()
        return cart.some((item) => item.id === productId)
    }

    if (isCartPage) {
        updateCartVisibility()

        productsData = await fetchProductsData(baseUrl, currentLang)

        if (cartItems.length !== 0) {
            initializeCart()
        }
        if (shippingSelect) {
            shippingSelect.addEventListener('change', calculateCartTotal)
        }
    }

    /**
     * Fonction pour charger les données produits
     */
    async function fetchProductsData(baseUrl, currentLang) {
        try {
            const response = await fetch(
                `${baseUrl}/products_${currentLang}.json`
            )
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
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
                (product) => String(product.id) === String(cartItem.id)
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

        // Utilisation de templates littéraux pour une meilleure lisibilité
        itemElement.innerHTML = `
<header class="product-header">
  <h2 id="${productData.title}" class="product-title">${productData.title}</h2>
</header>
<figure class="product-figure">
  <img 
      src="${productData.image}"
      class="product-image" 
      alt="${productData.title}" 
  />
</figure>
<section class="item-details">
  <data class="price" value="${productData.price}" itemprop="price">
    ${parseFloat(productData.price).toFixed(2)} €
  </data>
  <meta itemprop="priceCurrency" content="EUR" />
  <div class="qty-input">
    <button 
      class="qty-count qty-count--minus
       ${cartItem.qty === 1 ? 'disabled' : ''}" 
      data-action="minus"
      type="button"
      aria-label="t(${'button_remove_qty'}">
    -
    </button>
    <label for="qty-${cartItem.id}" class="display-none">
      ${t('quantity')}
    </label>
    <input
      id="qty-${cartItem.id}"
      class="product-qty item-qty"
      type="number"
      name="product-qty"
      data-id="${cartItem.id}"
      min="1"
      max="10"
      value="${cartItem.qty}"
    />
    <button 
      class="qty-count qty-count--add
        ${cartItem.qty === 10 ? 'disabled' : ''}" 
      data-action="add"
      type="button"
      aria-label="${t('button_add_qty')}"
    >
    +
    </button>
  </div>
  <data 
    class="item-total-price price" 
    value="${(parseFloat(productData.price) * cartItem.qty).toFixed(2)}"
    itemprop="price"
  >
  ${(parseFloat(productData.price) * cartItem.qty).toFixed(2)} €
  </data>
  <meta itemprop="priceCurrency" content="EUR" />
</section>
<footer class="product-footer">
  <a
    href="${productData.link}"
    class="btn btn-details" 
    aria-label="${t('button_detail')}">
    ${t('button_detail')}
  </a>
  <a 
    href="#"
    class="btn btn-card remove-from-cart"
    data-id="${cartItem.id}" 
    aria-label="${t('button_remove')}">
    ${t('button_remove')}
  </a>
</footer>`

        return itemElement
    }

    /**
     * Gestion de la modification de quantité via l'input
     */
    function handleQuantityChange(input) {
        updateQuantity(input)
    }

    /**
     * Gestion de la modification de quantité via les boutons
     */
    function handleButtonQuantityChange(button) {
        const input = button.closest('.qty-input').querySelector('.item-qty')
        const delta = button.dataset.action === 'add' ? 1 : -1
        updateQuantity(input, delta)
    }

    /**
     * Mise à jour de la quantité
     */
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

    /**
     * Suppression d'un produit du panier
     */
    function removeFromCart(productId) {
        let cart = storage.getCart()
        cart = cart.filter((item) => item.id !== productId)
        storage.setCart(cart)

        // Supprimer l'élément du DOM
        const qtyInput = document.querySelector(`#qty-${productId}`)
        if (qtyInput) {
            const itemElement = qtyInput.closest('.product-item')
            if (itemElement) {
                itemElement.remove()
            }
        }

        calculateCartTotal()
        updateCartLink()
        updateCartVisibility()
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
            (product) => String(product.id) === String(productId)
        )
        if (productData) {
            const qtyInput = document.querySelector(`#qty-${productId}`)
            if (qtyInput) {
                const itemTotalElement = qtyInput
                    .closest('.item-details')
                    .querySelector('.item-total-price')
                if (itemTotalElement) {
                    const itemTotal = parseFloat(productData.price) * newQty
                    itemTotalElement.textContent = `${itemTotal.toFixed(2)} €`
                }
            }
        }
    }

    /**
     * Mise à jour de l'état des boutons de quantité
     */
    function updateButtonState(productId, currentQty, min, max) {
        const qtyInput = document.querySelector(`#qty-${productId}`)
        if (qtyInput) {
            const qtyInputContainer = qtyInput.closest('.qty-input')
            const minusButton =
                qtyInputContainer.querySelector('.qty-count--minus')
            const addButton = qtyInputContainer.querySelector('.qty-count--add')

            minusButton.classList.toggle('disabled', currentQty <= min)
            addButton.classList.toggle('disabled', currentQty >= max)
        }
    }

    /**
     * Calcul du total du panier
     */
    function calculateCartTotal() {
        const cartItems = storage.getCart()
        let subtotal = 0
        let shippingGroups = {}

        cartItems.forEach((cartItem) => {
            const productData = productsData.find(
                (product) => String(product.id) === String(cartItem.id)
            )
            if (productData) {
                const itemTotal = parseFloat(productData.price) * cartItem.qty
                subtotal += itemTotal

                const qtyInput = document.querySelector(`#qty-${cartItem.id}`)
                if (qtyInput) {
                    const itemTotalElement = qtyInput
                        .closest('.item-details')
                        .querySelector('.item-total-price')
                    if (itemTotalElement) {
                        itemTotalElement.textContent = `${itemTotal.toFixed(2)} €`
                    }
                }

                // Grouping products by shipping type
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

        let totalShippingCost = 0
        let hasShipping = false

        Object.keys(shippingGroups).forEach((shippingType) => {
            const group = shippingGroups[shippingType]
            const colisCapacity = group.colisData.capacite_points
            const numberOfColis = Math.ceil(group.totalPoints / colisCapacity)
            const totalWeight = group.totalWeight + (group.colisData.poids_emballage * numberOfColis)
            const selectedZone = shippingSelect.value
            const cost = calculateCostForColis(totalWeight, selectedZone)
            totalShippingCost += cost
            hasShipping = true

            console.log(`Type d'envoi : ${shippingType}, Points total : ${group.totalPoints}, Nombre de colis : ${numberOfColis}, Poids total : ${totalWeight}, Coût : ${cost}`)
        })

        if (!hasShipping && shippingSelect) {
            shippingSelect.classList.add('disabled')
        } else if (shippingSelect) {
            shippingSelect.classList.remove('disabled')
        }

        const total = subtotal + totalShippingCost
        updateTicket(subtotal, totalShippingCost, total)
    }

    /**
     * Calcule les frais pour un type de colis dans une zone.
     */
    function calculateCostForColis(totalWeight, selectedZone) {
        const tarifs = shippingData.grille_tarifs[selectedZone].tarifs;
        const tarif = tarifs.find(t => totalWeight <= t.poids_max);
        return tarif ? tarif.tarif : 0;
    }

    /**
     * Mise à jour du ticket récapitulatif
     */
    function updateTicket(subtotal, shippingCost, total) {
        if (subtotalElement) {
            subtotalElement.textContent = `${subtotal.toFixed(2)} €`
        }
        if (shippingElement) {
            shippingElement.textContent = `${shippingCost.toFixed(2)} €`
        }
        if (totalElement) {
            totalElement.textContent = `${total.toFixed(2)} €`
        }
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
})
