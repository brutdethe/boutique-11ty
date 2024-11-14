document.addEventListener('DOMContentLoaded', async () => {
    const cartItems = storage.getCart()
    const cartContent = document.getElementById('cart-content')
    const shippingSelect = document.getElementById('shipping-country')
    const subtotalElement = document.querySelector('.subtotal-amount')
    const shippingElement = document.querySelector('.shipping-amount')
    const totalElement = document.querySelector('.total-amount')

    // Charger la langue actuelle et la base URL depuis le localStorage
    const currentLang = localStorage.getItem('lang') || 'en'
    const baseUrl = localStorage.getItem('baseUrl') || '/boutique-11ty'

    // Charger les données des produits à partir du fichier JSON approprié
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
            // Rechercher les informations du produit dans les données chargées
            const productData = productsData.find(
                (product) => product.id === cartItem.id
            )
            if (productData) {
                const itemElement = document.createElement('div')
                itemElement.classList.add('cart-item')
                itemElement.innerHTML = `
                    <a href="${productData.link}">
                        <img src="${productData.image}" alt="${
                    productData.title
                }" class="item-thumbnail">
                    </a>
                    <div class="item-details">
                        <h3>${productData.title}</h3>
                        <p>Prix unitaire : ${productData.price}</p>
                        <label for="qty-${cartItem.id}">Quantité :</label>
                        <input type="number" id="qty-${
                            cartItem.id
                        }" class="item-qty" data-id="${cartItem.id}" value="${
                    cartItem.qty
                }" min="1">
                        <p class="item-total-price">Prix total : ${(
                            parseFloat(productData.price) * cartItem.qty
                        ).toFixed(2)} €</p>
                        <button class="remove-from-cart" data-id="${
                            cartItem.id
                        }">Supprimer</button>
                    </div>
                `
                cartContent.appendChild(itemElement)
            }
        })

        // Ajouter les écouteurs pour la suppression des articles
        document.querySelectorAll('.remove-from-cart').forEach((button) => {
            button.addEventListener('click', (event) => {
                event.preventDefault()
                const productId = button.dataset.id
                removeFromCart(productId)
            })
        })

        // Ajouter les écouteurs pour les changements de quantité
        document.querySelectorAll('.item-qty').forEach((input) => {
            input.addEventListener('change', (event) => {
                const productId = input.dataset.id
                const newQty = parseInt(input.value)
                if (newQty > 0) {
                    updateCartItemQuantity(productId, newQty)
                } else {
                    removeFromCart(productId)
                }
            })
        })

        // Calculer et afficher le sous-total au chargement de la page
        calculateCartTotal()
    }

    // Mettre à jour les frais de transport en fonction du pays sélectionné
    shippingSelect.addEventListener('change', () => {
        calculateCartTotal()
    })

    // Fonction pour supprimer un article du panier
    function removeFromCart(productId) {
        let cart = storage.getCart()
        cart = cart.filter((item) => item.id !== productId)
        storage.setCart(cart)
        location.reload()
    }

    // Fonction pour mettre à jour la quantité d'un article dans le panier
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

    // Fonction pour calculer le total du panier
    function calculateCartTotal() {
        const cartItems = storage.getCart()
        let subtotal = 0

        cartItems.forEach((cartItem) => {
            const productData = productsData.find(
                (product) => product.id === cartItem.id
            )
            if (productData) {
                subtotal += parseFloat(productData.price) * cartItem.qty

                // Mettre à jour le prix total de chaque article dans l'affichage
                const itemTotalElement = document
                    .querySelector(`#qty-${cartItem.id}`)
                    .closest('.item-details')
                    .querySelector('.item-total-price')
                itemTotalElement.textContent = `Prix total : ${(
                    parseFloat(productData.price) * cartItem.qty
                ).toFixed(2)} €`
            }
        })

        const shippingCost = getShippingCost()
        const total = subtotal + shippingCost

        // Mettre à jour les éléments HTML du ticket
        updateTicket(subtotal, shippingCost, total)
    }

    // Fonction pour obtenir le coût de transport en fonction du pays sélectionné
    function getShippingCost() {
        const selectedOption =
            shippingSelect.options[shippingSelect.selectedIndex]
        return parseFloat(selectedOption.dataset.cost)
    }

    // Fonction pour mettre à jour l'affichage du ticket
    function updateTicket(
        subtotal,
        shippingCost,
        total = subtotal + shippingCost
    ) {
        subtotalElement.textContent = `${subtotal.toFixed(2)} €`
        shippingElement.textContent = `${shippingCost.toFixed(2)} €`
        totalElement.textContent = `${total.toFixed(2)} €`
    }
})
